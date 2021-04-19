import { Controller, Post, Request, UseGuards, Logger, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { Express } from 'express';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

import { LocalSignInDto } from './dto/local-sign-in.dto';

import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LocalSignInDto })
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
        this.logger.error(`failed to destroy user session: ${error}`);
      }
    });
  }
}
