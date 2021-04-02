import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { TeamsModule } from './teams/teams.module';
import { StrategiesModule } from './strategies/strategies.module';

@Module({
  controllers: [AppController],
  imports: [AuthModule, UsersModule, StrategiesModule, TeamsModule, DatabaseModule],
  providers: [AppService],
})
export class AppModule {}
