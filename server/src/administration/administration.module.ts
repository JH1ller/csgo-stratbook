import { Module } from '@nestjs/common';
import { AdministrationController } from './administration.controller';
import { AdministrationService } from './administration.service';

@Module({
  controllers: [AdministrationController],
  providers: [AdministrationService],
})
export class AdministrationModule {}
