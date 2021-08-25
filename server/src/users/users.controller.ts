import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
  InternalServerErrorException,
  Param,
  Res,
  Logger,
  OnModuleInit,
} from '@nestjs/common';

import { ModuleRef } from '@nestjs/core';

import { FileInterceptor } from '@nestjs/platform-express';

import {
  ApiOkResponse,
  ApiCreatedResponse,
  ApiConsumes,
  ApiBody,
  ApiTags,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { ConfigService } from '@nestjs/config';

import { Types } from 'mongoose';
import { Express, Response, Request } from 'express';
import urljoin from 'url-join';

import { UsersService } from './users.service';

import { RegisterUserDto } from './dto/register-user.dto';
import { ProfileUpdateDto } from './dto/profile-update.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

import { GetUserResponse } from './responses/get-user.response';
import { RegisterUserResponse } from './responses/register-user.response';
import { ForgotPasswordResponse } from './responses/forgot-password.response';
import { GetTeamResponse } from 'src/teams/responses/get-team.response';

import { User } from 'src/schemas/user.schema';

import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';

import { TeamsService } from 'src/teams/teams.service';
import { StrategiesService } from 'src/strategies/strategies.service';

import { ImageProcessorService } from 'src/services/image-processor/image-processor.service';
import { CaptchaService } from 'src/services/captcha/captcha.service';
import { MinioService } from 'src/services/minio/minio-service.service';

@Controller('users')
@ApiTags('Users')
export class UsersController implements OnModuleInit {
  private readonly logger = new Logger(UsersController.name);

  private readonly mailTransportDisabled: boolean;

  private teamsService: TeamsService;

  private strategiesService: StrategiesService;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly imageProcessorService: ImageProcessorService,
    private readonly captchaService: CaptchaService,
    private readonly minioService: MinioService,
    private moduleRef: ModuleRef
  ) {
    this.mailTransportDisabled = this.configService.get<boolean>('debug.mailTransportDisabled');
  }

  public onModuleInit() {
    // get teams service after construction to prevent a circular dependency between
    // UserModule and TeamsModule.
    this.teamsService = this.moduleRef.get(TeamsService, { strict: false });
    this.strategiesService = this.moduleRef.get(StrategiesService, { strict: false });
  }

  @Post('/register')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiCreatedResponse({ type: RegisterUserResponse })
  @ApiBadRequestResponse()
  public async registerUser(@Body() model: RegisterUserDto) {
    const { userName, email, password } = model;

    const _id = await this.usersService.createUser(userName, email, password);
    const emailToken = await this.usersService.sendVerifyEmailRequest(_id, email, userName);

    if (this.mailTransportDisabled) {
      // debug: return email token with the response when mail transport is disabled
      return new RegisterUserResponse({
        _id,
        email,
        emailToken,
      });
    }

    return new RegisterUserResponse({
      _id,
      email,
    });
  }

  @Delete('/delete')
  @UseGuards(AuthenticatedGuard)
  public async deleteUser(@Body() model: DeleteUserDto, @Req() req: Request) {
    if (req.user.userName !== model.userName) {
      throw new BadRequestException('User name does not match');
    }

    // user object will be destroy on logout
    const userId = req.user._id;
    const teamId = req.user.team;

    // logout user
    req.logout();

    // destroy session data
    req.session.destroy((error: string) => {
      if (error) {
        this.logger.error(`failed to destroy user session: ${error}`);
      }
    });

    if (teamId) {
      // force team leave on deletion
      await this.teamsService.leaveTeam(teamId, userId, true);
    }

    await this.usersService.deleteUser(userId);
  }

  @Get('/get')
  @UseGuards(AuthenticatedGuard)
  @ApiOkResponse({ type: GetUserResponse })
  public async getUser(@Req() req: Request) {
    const data: Partial<GetUserResponse> = {
      ...req.user.toObject(),
      team: null,
    };

    if (req.user.team) {
      const team = await this.teamsService.findById(req.user.team);
      data.team = new GetTeamResponse(team.toObject());
    }

    return new GetUserResponse(data);
  }

  @Patch('/update')
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOkResponse()
  public async updateUser(
    @Body() model: ProfileUpdateDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request
  ) {
    const { user } = req;
    const userDiff: Partial<User> = {};

    if (file) {
      userDiff.avatar = await this.imageProcessorService.uploadImage(file.path, {
        width: 256,
        height: 256,
      });

      if (user.avatar) {
        // delete old user avatar from minio bucket
        await this.minioService.deleteImage(user.avatar);
      }
    }

    if (model.email) {
      await this.usersService.sendEmailChangeRequest(user, model.email);
    }

    if (model.password) {
      userDiff.password = await this.usersService.hashPassword(model.password);
    }

    if (model.userName) {
      userDiff.userName = model.userName;

      // replace the user name inside strategies
      if (model.updateStrategies && user.team) {
        await this.strategiesService.replaceUserName(user.team, user.userName, model.userName);
      }
    }

    if (model.completedTutorial) {
      userDiff.completedTutorial = model.completedTutorial;
    }

    // finally update user data by passing our diff object
    await this.usersService.updateUser(user._id, userDiff);
  }

  /**
   *
   * @param file
   * @param req
   */
  @Patch('/update-avatar')
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOkResponse()
  public async updateAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const { user } = req;

    if (file) {
      const avatar = await this.imageProcessorService.uploadImage(file.path, {
        width: 256,
        height: 256,
      });

      await this.usersService.updateAvatar(user.id, avatar);

      if (user.avatar) {
        // delete old user avatar from minio bucket
        await this.minioService.deleteImage(user.avatar);
      }
    }
  }

  /**
   * User confirms email by token
   */
  @Get('/confirm/email/:token')
  public async userConfirmEmail(@Param('token') token: string, @Res() res: Response) {
    const { id } = this.usersService.verifyEmailConfirmRequest(token);

    const user = await this.usersService.findById(id);
    if (!user) {
      throw new InternalServerErrorException('user does not exists with the specified id');
    }

    const baseUrl = this.configService.get<string>('baseUrl');

    // simply redirect the user if the mail already has been confirmed
    if (user.emailConfirmed) {
      return res.redirect(urljoin(baseUrl, `/#/login?already_confirmed=${user.email}`));
    }

    await this.usersService.updateEmailConfirmed(user._id, true);
    return res.redirect(urljoin(baseUrl, `/#/login?confirmed=${user.email}`));
  }

  @Get('/confirm/update-email/:token')
  public async userConfirmEmailUpdate(@Param('token') token: string, @Res() res: Response) {
    const { id, email } = this.usersService.verifyEmailChangeRequest(token);

    const user = await this.usersService.findById(id);
    if (!user) {
      throw new InternalServerErrorException('user does not exists with the specified id');
    }

    // don't hit the db if the user attempts to update the mail multiple times.
    if (email === user.email) {
      throw new BadRequestException('Email has already been updated!');
    }

    await this.usersService.updateEmailAddress(user._id, email);

    const baseUrl = this.configService.get<string>('baseUrl');
    return res.redirect(urljoin(baseUrl, '/#/profile?confirmed=1'));
  }

  @Post('/forgot-password')
  @ApiCreatedResponse({ type: ForgotPasswordResponse })
  @ApiBadRequestResponse()
  public async forgotPassword(@Body() model: ForgotPasswordDto) {
    const { email, captchaResponse } = model;

    const result = await this.captchaService.verify(captchaResponse);
    if (!result) {
      throw new BadRequestException('Failed to verify captcha token');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('user was not found by this email');
    }

    const token = await this.usersService.sendForgotPasswordRequest(user);

    if (this.mailTransportDisabled) {
      // return payload when mail transport is disabled
      return new ForgotPasswordResponse(token);
    }

    return new ForgotPasswordResponse();
  }

  @Patch('/reset-password')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  public async resetPassword(@Body() model: ResetPasswordDto) {
    const { password, token, captchaResponse } = model;

    const result = await this.captchaService.verify(captchaResponse);
    if (!result) {
      return new BadRequestException('failed to verify captcha');
    }

    const { id } = this.usersService.verifyForgotPasswordRequest(token);

    const user = await this.usersService.findById(id);
    if (!user) {
      throw new InternalServerErrorException('invalid user specified in token');
    }

    await this.usersService.updatePassword(new Types.ObjectId(id), password);
  }
}
