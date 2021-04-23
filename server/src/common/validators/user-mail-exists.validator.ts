import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

import { UsersService } from 'src/users/users.service';

@ValidatorConstraint({ name: 'UserMailExists', async: true })
@Injectable()
export class UserMailExistsRule implements ValidatorConstraintInterface {
  constructor(private usersService: UsersService) {}

  public validate(value: string) {
    return this.usersService.existsByEmail(value);
  }

  public defaultMessage() {
    return 'Email address is: already in use';
  }
}

export function UserEmailExists(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'UserExists',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UserMailExistsRule,
    });
  };
}
