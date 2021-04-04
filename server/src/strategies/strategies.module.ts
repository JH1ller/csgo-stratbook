import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StrategiesController } from './strategies.controller';
import { StrategiesService } from './strategies.service';

import { Strategy, StrategySchema } from 'src/schemas/strategy.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Strategy.name, schema: StrategySchema }])],
  controllers: [StrategiesController],
  providers: [StrategiesService],
  exports: [StrategiesService],
})
export class StrategiesModule {}
