import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Schema } from 'mongoose';

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
    const id = new Schema.Types.ObjectId(value);
    return this.usersService.existsById(id);
  }

  public defaultMessage(args: ValidationArguments) {
    return `User does not exist by id ${args.value as string}`;
  }
}
