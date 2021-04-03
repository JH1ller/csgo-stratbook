import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { UsersModule } from 'src/users/users.module';

import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './passport/session.serializer';

@Module({
  imports: [UsersModule, PassportModule.register({ session: true })],

  controllers: [AuthController],
  providers: [AuthService, SessionSerializer, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
