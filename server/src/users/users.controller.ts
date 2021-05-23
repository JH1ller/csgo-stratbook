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
import { GetTeamResponse } from 'src/teams/responses/get-team.response';

import { User } from 'src/schemas/user.schema';

import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';

import { TeamsService } from 'src/teams/teams.service';
import { StrategiesService } from 'src/strategies/strategies.service';

import { ImageUploaderService } from 'src/services/image-uploader/image-uploader.service';
import { CaptchaService } from 'src/services/captcha/captcha.service';
import { ResourceManagerService } from 'src/services/resource-manager/resource-manager.service';

@Controller('users')
@ApiTags('Users')
export class UsersController implements OnModuleInit {
  private readonly logger = new Logger(UsersController.name);

  private teamsService: TeamsService;

  private strategiesService: StrategiesService;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly imageUploaderService: ImageUploaderService,
    private readonly captchaService: CaptchaService,
    private readonly resourceManagerService: ResourceManagerService,
    private moduleRef: ModuleRef
  ) {}

  public onModuleInit() {
    // get teams service after construction to prevent a circular dependency between
    // UserModule and TeamsModule.
    this.teamsService = this.moduleRef.get(TeamsService, { strict: false });
    this.strategiesService = this.moduleRef.get(StrategiesService, { strict: false });
  }

  @Post('register')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiCreatedResponse({ type: RegisterUserResponse })
  @ApiBody({ description: 'Register new user', type: RegisterUserDto })
  public async registerUser(@Body() model: RegisterUserDto, @UploadedFile() file: Express.Multer.File) {
    let avatar: string;
    if (file) {
      avatar = await this.imageUploaderService.addJob({
        source: file.path,
        resize: {
          width: 256,
          height: 256,
        },
      });
    }

    const user = await this.usersService.createUser(model.userName, model.email, model.password, avatar);
    const { _id, email } = user;

    return new RegisterUserResponse({
      _id,
      email,
    });
  }

  @Delete()
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

    // force team leave on deletion
    await this.teamsService.leaveTeam(teamId, userId, true);
    await this.usersService.deleteUser(userId);
  }

  @Get()
  @UseGuards(AuthenticatedGuard)
  @ApiOkResponse({ type: GetUserResponse })
  public async getUser(@Req() req: Request) {
    const team = await this.teamsService.findById(req.user.team);

    const obj = new GetUserResponse({
      ...req.user.toObject(),
      team: team ? new GetTeamResponse(team.toObject()) : null,
    });

    return obj;
  }

  @Patch()
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

    if (file !== null) {
      userDiff.avatar = await this.imageUploaderService.addJob({
        source: file.path,
        resize: {
          width: 256,
          height: 256,
        },
      });

      // delete old user avatar from s3 bucket
      await this.resourceManagerService.deleteImage(user.avatar);
    }

    if (model.email !== null) {
      await this.usersService.sendEmailChangeRequest(user, model.email);
    }

    if (model.password !== null) {
      userDiff.password = await this.usersService.createPasswordHash(model.password);
    }

    if (model.userName !== null) {
      userDiff.userName = model.userName;

      // replace the user name inside strategies
      if (model.updateStrategies && user.team) {
        await this.strategiesService.replaceUserName(user.team, user.userName, model.userName);
      }
    }

    if (model.completedTutorial !== null) {
      userDiff.completedTutorial = model.completedTutorial;
    }

    // finally update user data by passing our diff object
    await this.usersService.updateUser(user._id, userDiff);
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
  @ApiOkResponse()
  @ApiBadRequestResponse()
  public async forgotPassword(@Body() model: ForgotPasswordDto) {
    const result = await this.captchaService.verify(model.captchaResponse);
    if (!result) {
      throw new BadRequestException('Failed to verify captcha token');
    }

    const user = await this.usersService.findByEmail(model.email);
    if (user === null) {
      throw new BadRequestException('user was not found by this email');
    }

    await this.usersService.sendForgotPasswordRequest(user);
  }

  @Patch('/reset-password')
  public async resetPassword(@Body() model: ResetPasswordDto) {
    const result = await this.captchaService.verify(model.captchaResponse);
    if (!result) {
      return new BadRequestException('failed to verify captcha');
    }

    const { id } = this.usersService.verifyForgotPasswordRequest(model.token);

    const user = await this.usersService.findById(id);
    if (!user) {
      throw new InternalServerErrorException('invalid user specified in token');
    }

    await this.usersService.updatePassword(new Types.ObjectId(id), model.password);
  }
}
