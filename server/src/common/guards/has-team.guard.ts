import { ExecutionContext, Injectable, CanActivate, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class HasTeamGuard implements CanActivate {
  public canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    if (!request.user) {
      throw new UnauthorizedException();
    }

    if (!request.user.team) {
      throw new BadRequestException('You need to join a team first');
    }

    return true;
  }
}
