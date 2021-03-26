import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { StrategiesController } from './strategies/strategies.controller';
import { DatabaseModule } from './database/database.module';

import { TeamsModule } from './teams/teams.module';
import { TeamsController } from './teams/teams.controller';
import { TeamsService } from './teams/teams.service';

import { StrategiesModule } from './strategies/strategies.module';
import { StrategiesService } from './strategies/strategies.service';

@Module({
  imports: [AuthModule, UsersModule, StrategiesModule, TeamsModule, DatabaseModule],
  controllers: [AppController, StrategiesController, TeamsController],
  providers: [AppService, StrategiesService, TeamsService],
})
export class AppModule {}
