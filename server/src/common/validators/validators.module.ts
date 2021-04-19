import { Module } from '@nestjs/common';

import { UserExistsRule } from './user-exists.validator';
import { UserMailExistsRule } from './user-mail-exists.validator';
import { UserMailNotInUseRule } from './user-mail-not-in-use.validator';

import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [UserExistsRule, UserMailExistsRule, UserMailNotInUseRule],
})
export class ValidatorsModule {}
