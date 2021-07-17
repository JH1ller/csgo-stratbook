import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import urljoin from 'url-join';
import ms from 'ms';

import { MailSendJob } from './job/mail-send-job';

import ResetPasswordTemplate from './templates/reset-password.hbs';
import VerifyEmail from './templates/verify-email.hbs';
import VerifyNewEmailTemplate from './templates/verify-new-email.hbs';

@Injectable()
export class MailerService {
  private readonly baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectQueue('mailer') private mailQueue: Queue<MailSendJob>
  ) {
    this.baseUrl = this.configService.get<string>('baseUrl');
  }

  public async sendPasswordResetMail(emailTo: string, userName: string, token: string) {
    const context = {
      userName,
      link: urljoin(this.baseUrl, `/#/reset?token=${token}`),
    };

    await this.addJob({
      emailTo,
      subject: 'Stratbook - Reset password',
      context,
      template: ResetPasswordTemplate,
    });
  }

  /**
   * Sends the confirm-email-mail to the specified @name email
   * @param emailTo destination email
   * @param userName name of the user, used in email titles
   * @param token jwt encoded confirmation token
   */
  public async sendVerifyEmail(emailTo: string, userName: string, token: string) {
    const context = {
      userName,
      link: urljoin(this.baseUrl, `/auth/confirmation/${token}`),
    };

    await this.addJob({
      emailTo,
      subject: `Hi ${userName} - verify your Stratbook email`,
      context,
      template: VerifyEmail,
    });
  }

  public async sendVerifyNewEmailRequest(emailTo: string, userName: string, token: string) {
    const context = {
      userName,
      // update link
      link: urljoin(this.baseUrl, `/#/reset?token=${token}`),
    };

    await this.addJob({
      emailTo,
      subject: 'Stratbook - Verify new email',
      context,
      template: VerifyNewEmailTemplate,
    });
  }

  private addJob(data: MailSendJob) {
    return this.mailQueue.add(data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: ms('30s'),
      },
    });
  }
}
