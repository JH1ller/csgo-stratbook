import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StrategiesController } from './strategies.controller';
import { StrategiesService } from './strategies.service';

import { Strategy, StrategySchema } from 'src/schemas/strategy.schema';

import { TeamsModule } from 'src/teams/teams.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Strategy.name, schema: StrategySchema }]),
    forwardRef(() => TeamsModule),
  ],
  controllers: [StrategiesController],
  providers: [StrategiesService],
  exports: [StrategiesService],
})
export class StrategiesModule {}
