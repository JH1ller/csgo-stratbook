import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Request } from 'express';

/**
 * @summary In vanilla express-js passport is called before the actual route is
 * handled. This is the exact same thing, but in nestjs we need to use a guard instead of chaining
 * passport in front of our route
 * eg: router.post('/register', passport_auth, (req, res) => {...})
 *
 * @description 'local' is a magic string, which needs to be referenced by PassportStrategy(..., 'local')
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  public async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest<Request>();

    // now we call passport's login method
    // http://www.passportjs.org/docs/login/
    await super.logIn(request);

    return result;
  }
}
