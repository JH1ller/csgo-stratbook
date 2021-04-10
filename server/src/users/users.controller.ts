import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Request,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';

import { Express } from 'express';

import { UsersService } from './users.service';

import { RegisterUserDto } from './dto/register-user.dto';
import { ProfileUpdateDto } from './dto/profile-update.dto';

import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { ImageUploaderService } from 'src/services/image-uploader/image-uploader.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly imageUploaderService: ImageUploaderService
  ) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiCreatedResponse()
  public async registerUser(@Body() model: RegisterUserDto, @UploadedFile() file: Express.Multer.File) {
    console.log(file);

    if (await this.usersService.isEmailInUse(model.email)) {
      throw new BadRequestException('email is already in use.');
    }

    const user = await this.usersService.createUser(model.userName, model.email, model.password);
    console.log(user);

    // upload avatar
  }

  @Get()
  @UseGuards(AuthenticatedGuard)
  @ApiOkResponse()
  public getUser(@Request() req: Express.Request) {
    const {
      _id,
      userName,
      // role, // this property doesn't exist (deleted?)
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
}
