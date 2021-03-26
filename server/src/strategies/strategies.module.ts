import { Module } from '@nestjs/common';

import { StrategiesController } from './strategies.controller';
import { StrategiesService } from './strategies.service';

@Module({
  controllers: [StrategiesController],
  providers: [StrategiesService],
  exports: [StrategiesService],
})
export class StrategiesModule {}
