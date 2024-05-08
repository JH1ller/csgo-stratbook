import path from 'node:path';

import Email from 'email-templates';
import nodemailer from 'nodemailer';
import urljoin from 'url-join';

import { configService } from '@/services/config.service';
import { Logger } from '@/utils/logger';

import { getErrorMessage } from '../utils/errors/parseError';

const logger = new Logger('MailService');

export const MailTemplate = {
  VERIFY_NEW: 'verifyNew',
  VERIFY_CHANGE: 'verifyChange',
  RESET_PASSWORD: 'resetPassword',
} as const;

export type MailTemplate = (typeof MailTemplate)[keyof typeof MailTemplate];

class MailService {
  private transporter: nodemailer.Transporter;
  private email: Email;
  private readonly sender = 'Stratbook <support@stratbook.pro>';

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: configService.env.MAIL_HOST,
      port: 587,
      secure: false,
      tls: {
        ciphers: 'SSLv3',
      },
      auth: {
        user: configService.env.MAIL_USER,
        pass: configService.env.MAIL_PW,
      },
    });

    this.email = new Email({
      message: {
        from: this.sender,
      },
      send: true,
      transport: this.transporter,
      juice: true,
      juiceResources: {
        webResources: {
          relativeTo: path.join(process.cwd(), 'templates', 'css'),
        },
      },
    });
  }

  sendMail = async (to: string, token: string, name: string, template: MailTemplate) => {
    const link =
      template === MailTemplate.RESET_PASSWORD
        ? urljoin(configService.urls.appUrl, `/reset?token=${token}`)
        : urljoin(configService.urls.apiUrl, `/auth/confirmation/${token}`);

    try {
      const res = await this.email.send({
        template: path.join(process.cwd(), 'templates', template),
        message: {
          to,
        },
        locals: {
          name,
          link,
        },
      });
      logger.success('Successfully sent verification mail with id: ' + res.messageId);
    } catch (error) {
      logger.error(getErrorMessage(error));
      throw error;
    }
  };
}

const mailService = new MailService();

export { mailService };
