import { Controller, Post, Req, Request, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  public login(@Request() req) {
    // req.user
    console.log(req);
    return this.authService.login();
  }

  @Post('local/signin')
  @ApiResponse({ status: 200 })
  public localSignIn(@Req() request: FastifyRequest) {
    request.session.set('data', request.body);

    console.log(request);
  }
}
