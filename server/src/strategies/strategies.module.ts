import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StrategiesController } from './strategies.controller';
import { StrategiesService } from './strategies.service';

import { Strategy, StrategySchema } from 'src/schemas/strategy.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Strategy.name, schema: StrategySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [StrategiesController],
  providers: [StrategiesService],
  exports: [StrategiesService],
})
export class StrategiesModule {}
