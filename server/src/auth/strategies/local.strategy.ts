import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { Strategy } from 'passport-local';

import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      // use email field in rest requests
      usernameField: 'email',
    });
  }

  public validate(email: string, password: string) {
    return this.authService.localValidateUser(email, password);
  }
}
