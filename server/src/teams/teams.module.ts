import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

import { Team, TeamSchema } from 'src/schemas/team.schema';

import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]), UsersModule],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
