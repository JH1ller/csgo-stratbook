import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import * as express from 'express';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('local/signin')
  public login(@Request() req: express.Request) {
    // req.user
    // console.log(req);
    return this.authService.login();
  }

  @UseGuards(AuthenticatedGuard)
  @Post('logout')
  public logout(@Request() req: express.Request) {
    req.logout();
  }
}
