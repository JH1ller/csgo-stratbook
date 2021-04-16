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
  Request,
  InternalServerErrorException,
  Param,
  Response,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse, ApiCreatedResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { Express } from 'express';
import urljoin from 'url-join';

import { UsersService } from './users.service';

import { RegisterUserDto } from './dto/register-user.dto';
import { ProfileUpdateDto } from './dto/profile-update.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { ImageUploaderService } from 'src/services/image-uploader/image-uploader.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly imageUploaderService: ImageUploaderService
  ) {}

  @Post('register')
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse()
  @ApiBody({ description: 'Register new user', type: RegisterUserDto })
  @UseInterceptors(FileInterceptor('avatar'))
  public async registerUser(@Body() model: RegisterUserDto, @UploadedFile() file: Express.Multer.File) {
    console.log(file);

    if (await this.usersService.isEmailInUse(model.email)) {
      throw new BadRequestException('email is already in use.');
    }

    const avatar = await this.imageUploaderService.addJob({
      source: file.path,
      resize: {
        width: 256,
        height: 256,
      },
    });

    const user = await this.usersService.createUser(model.userName, model.email, model.password, avatar);
    console.log(user);
  }

  @Delete()
  public async deleteUser(@Body() model: DeleteUserDto, @Request() req: Express.Request) {
    if (req.user.userName !== model.userName) {
      throw new BadRequestException('User name does not match');
    }

    await this.usersService.deleteUser(req.user.id);
  }

  @Get('/confirmation/:token')
  public userConfirmation(
    @Param('token') token: string,
    @Request() req: Express.Request,
    @Response() res: Express.Response
  ) {
    const baseUrl = this.configService.get<string>('baseUrl');

    // if (req.user.mailConfirmed) {
    //   res.redirect(urljoin(baseUrl, `/#/login?already_confirmed=${req.user.email}`));
    // }
  }

  @Get()
  @UseGuards(AuthenticatedGuard)
  @ApiOkResponse()
  public getUser(@Request() req: Express.Request) {
    const {
      _id,
      userName,
      avatar,
      team,
      email,
      mailConfirmed,
      isAdmin,
      createdAt,
      isOnline,
      lastOnline,
      completedTutorial,
    } = req.user;

    return {
      id: _id.toString(),
      userName,
      avatar,
      team,
      email,
      mailConfirmed,
      isAdmin,
      createdAt,
      isOnline,
      lastOnline,
      completedTutorial,
    };
  }

  @Patch()
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOkResponse()
  public async updateUser(
    @Body() model: ProfileUpdateDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: Express.Request
  ) {
    // #todo: reduce update queries

    if (model.password !== null) {
      const result = await this.usersService.updatePassword(req.user.id, model.password);
      if (!result.ok) {
        throw new InternalServerErrorException('failed to update user password');
      }
    }

    if (model.userName !== null) {
      const result = await this.usersService.updateUserName(req.user.id, model.userName);
      if (!result.ok) {
        throw new InternalServerErrorException('failed to update user name');
      }
    }

    if (file !== null) {
      console.log(file);
    }

    if (model.completedTutorial !== null) {
      const result = await this.usersService.updateCompletedTutorial(req.user.id, model.completedTutorial);
      if (!result.ok) {
        throw new InternalServerErrorException('failed to update completed tutorial');
      }
    }

    await req.user.save();
  }

  @Post('/forgot-password')
  public async forgotPassword(@Body() model: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(model.email);
    if (user === null) {
      throw new BadRequestException('user was not found by this email');
    }

    this.usersService.sendForgotPasswordRequest(user);
  }
}
