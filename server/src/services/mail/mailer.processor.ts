import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('mailer')
export class MailerProcessor {
  private readonly logger = new Logger(MailerProcessor.name);

  @Process('send')
  public handleSend(job: Job) {
    console.log(job.data);
  }
}
