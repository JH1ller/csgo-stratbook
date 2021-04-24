import { validate } from 'class-validator';
import { Injectable, BadRequestException } from '@nestjs/common';

import bcrypt from 'bcrypt';

import { LocalSignInDto } from './dto/local-sign-in.dto';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  /**
   * local user validation
   * @param email user account email
   * @param password password
   * @returns user document
   */
  public async localValidateUser(email: string, password: string) {
    const model: LocalSignInDto = {
      email,
      password,
    };

    const result = await validate(model);
    if (result.length > 0) {
      throw new BadRequestException(result);
    }

    const user = await this.usersService.findByEmail(email);
    if (user === null) {
      throw new BadRequestException({
        error: 'Email or password is invalid.',
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new BadRequestException({
        error: 'Password is invalid.',
      });
    }

    if (!user.mailConfirmed) {
      throw new BadRequestException({
        error: 'Please confirm your email to log in.',
      });
    }

    return user;
  }
}
