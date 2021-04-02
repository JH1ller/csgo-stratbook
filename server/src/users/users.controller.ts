import { Controller, Post, Request } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Post('register')
  public registerUser(@Request() req) {
    console.log(req);
  }
}
