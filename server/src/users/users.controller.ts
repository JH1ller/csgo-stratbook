import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';

import { RegisterUserDto } from './dto/register-user.dto';

@Controller('users')
export class UsersController {
  @Post('register')
  @ApiCreatedResponse()
  public registerUser(@Body() registerUserDto: RegisterUserDto) {
    console.log(registerUserDto);
  }
}
