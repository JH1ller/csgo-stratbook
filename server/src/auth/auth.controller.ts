import { Controller, Post, Request, UseGuards, Logger } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Express } from 'express';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

import { LocalSignInDto } from './dto/local-sign-in.dto';

import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('local/signin')
  @ApiBody({ type: LocalSignInDto })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  public login() {
    // login is performed by LocalAuthGuard.
  }

  @UseGuards(AuthenticatedGuard)
  @Post('logout')
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
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
