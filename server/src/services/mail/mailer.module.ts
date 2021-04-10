import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { MailerService } from './mailer.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mailer',
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
