import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { MailerProcessor } from './mailer.processor';
import { MailerService } from './mailer.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mailer',
    }),
  ],
  providers: [MailerProcessor, MailerService],
  exports: [MailerService],
})
export class MailerModule {}
