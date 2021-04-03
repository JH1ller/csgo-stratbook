import { Injectable, BadRequestException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  public async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (user == null) {
      throw new BadRequestException({
        error: 'Email or password is invalid.',
      });
    }

    const passwordValid = await bcrypt.compare(user.password, password);
    if (!passwordValid) {
      throw new BadRequestException({
        error: 'Email or password is invalid.',
      });
    }

    if (!user.mailConfirmed) {
      throw new BadRequestException({
        error: 'Please confirm your email to log in.',
      });
    }

    return user;
  }

  public login() {
    return {
      access_token: '',
    };
  }
}
