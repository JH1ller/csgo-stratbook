import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { Express } from 'express';

import { UsersService } from './users.service';

import { RegisterUserDto } from './dto/register-user.dto';

import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
  }

  @Get()
  @UseGuards(AuthenticatedGuard)
  @ApiCreatedResponse()
  public getUser(@Request() req: Express.Request) {
    //
    console.log('req.user', req.user);
  }
}
