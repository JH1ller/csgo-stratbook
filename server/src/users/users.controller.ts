import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { RegisterUserDto } from './dto/register-user.dto';

@Controller('users')
export class UsersController {
  @Post('register')
  @ApiResponse({ status: 200 })
  public registerUser(@Body() registerUserDto: RegisterUserDto) {
    console.log(registerUserDto);
  }
}
