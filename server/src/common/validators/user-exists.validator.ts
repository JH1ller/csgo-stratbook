import { Injectable } from '@nestjs/common';
import { ValidatorConstraint } from 'class-validator';
import { Types } from 'mongoose';

import type { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

import { UsersService } from 'src/users/users.service';

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UserExistsRule implements ValidatorConstraintInterface {
  constructor(private usersService: UsersService) {}

  /**
   * accepts mongodb ids as string
   * @param value user id
   */
  public validate(value: string) {
    const id = new Types.ObjectId(value);
    return this.usersService.existsById(id);
  }

  public defaultMessage(args: ValidationArguments) {
    return `User does not exist by id ${args.value as string}`;
  }
}
