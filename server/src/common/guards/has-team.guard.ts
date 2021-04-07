import { ExecutionContext, Injectable, CanActivate, BadRequestException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class HasTeamGuard implements CanActivate {
  public canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    if (request.user.team === null) {
      throw new BadRequestException('Authenticated user does not have a team');
    }

    return true;
  }
}
