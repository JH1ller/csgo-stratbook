import { Controller, Post, Request, UseGuards, Logger, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Express } from 'express';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  public login() {
    // login is performed by LocalAuthGuard.
  }

  @UseGuards(AuthenticatedGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  public logout(@Request() req: Express.Request) {
    req.logout();

    // destroy session data
    req.session.destroy((error: string) => {
      if (error) {
        Logger.error(`failed to destroy user session: ${error}`);
      }
    });
  }
}
