import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

import { UsersService } from 'src/users/users.service';

@Injectable()
@ValidatorConstraint({ name: 'UserMailNotInUse', async: true })
export class UserMailNotInUseRule implements ValidatorConstraintInterface {
  constructor(private usersService: UsersService) {}

  /**
   * @param value user email
   */
  public async validate(value: string) {
    const isInUse = await this.usersService.isEmailInUse(value);

    return isInUse === false;
  }

  public defaultMessage(args: ValidationArguments) {
    return `${args.value as string} is already in use!`;
  }
}
