import { Body, Controller, Post } from '@nestjs/common';

import { RegisterUserDto } from './dto/register-user.dto';

@Controller('users')
export class UsersController {
  @Post('register')
  public registerUser(@Body() registerUserDto: RegisterUserDto) {
    console.log(registerUserDto);
  }
}
