import { Module } from '@nestjs/common';
import { LandingController } from './landing.controller';

@Module({
  controllers: [LandingController],
})
export class LandingModule {}
