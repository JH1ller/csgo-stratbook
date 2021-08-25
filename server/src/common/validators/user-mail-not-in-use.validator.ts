import { Injectable } from '@nestjs/common';
import { ValidatorConstraint } from 'class-validator';

import type { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

import { UsersService } from 'src/users/users.service';

/**
 * Validator, for checking if a user-email is already registered.
 * We could handle this step inside the controller itself, but
 * then we would have to accept every (multer-) file request.
 */
@Injectable()
@ValidatorConstraint({ name: 'UserMailNotInUse', async: true })
export class UserMailNotInUseRule implements ValidatorConstraintInterface {
  constructor(private usersService: UsersService) {}

  /**
   * @param value user email
   */
  public async validate(value: string) {
    const userExists = await this.usersService.existsByEmail(value);

    return !userExists;
  }

  public defaultMessage(args: ValidationArguments) {
    return `${args.value as string} is already in use!`;
  }
}
