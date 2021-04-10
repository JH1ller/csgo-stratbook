import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import nodemailer, { Transporter } from 'nodemailer';
import Handlebars from 'handlebars';
import mjml = require('mjml');
import { htmlToText } from 'html-to-text';

import ResetPasswordTemplate from 'src/services/mail/templates/reset-password.hbs';

/**
 * Converts params to string and appends all to one string output
 * @param params bunyan log param array
 * @returns output string
 */
function toLoggerString(...params: any[]) {
  let output = '';

  for (let i = 0; i < params.length; i++) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    output += `${params[i]}`;

    if (i <= params.length - 1) {
      output += ' ';
    }
  }

  return output;
}

@Injectable()
export class MailerService {
  private readonly transporter: Transporter;

  constructor(private readonly configService: ConfigService, @InjectQueue('mailer') private mailQueue: Queue) {
    if (this.configService.get<boolean>('debug.mailTransportDisabled')) {
      Logger.warn('Email transport is disabled');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('mail.host'),
      port: this.configService.get<number>('mail.port'),
      secure: false,

      tls: {
        ciphers: 'SSLv3',
      },

      auth: {
        user: this.configService.get<string>('mail.user'),
        pass: this.configService.get<string>('mail.password'),
      },

      logger: {
        level: () => {
          // empty
        },

        trace: (...params: any[]) => Logger.verbose(toLoggerString(params)),
        debug: (...params: any[]) => Logger.debug(toLoggerString(params)),
        info: (...params: any[]) => Logger.debug(toLoggerString(params)),
        warn: (...params: any[]) => Logger.warn(toLoggerString(params)),
        error: (...params: any[]) => Logger.error(toLoggerString(params)),
        fatal: (...params: any[]) => Logger.error(toLoggerString(params)),
      },

      dkim: {
        domainName: 'stratbook.live',
        keySelector: 's1',
        privateKey: configService.get<string>('mail.privateKey'),
      },
    });

    // this.transporter.verify();
  }

  private async sendMail(to: string, subject: string, html: string) {
    if (this.configService.get<boolean>('debug.mailTransportDisabled')) {
      Logger.debug(`Skip mail: ${to} ${subject}`);
      return;
    }

    // nodemailer-base64-to-s3
    const text = htmlToText(html);

    // see https://nodemailer.com/usage/
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const info = await this.transporter.sendMail({
      from: 'Stratbook <support@stratbook.live>',
      to,
      subject,
      html,
      text,
    });

    console.log(info);
  }

  public sendPasswordResetMail(email: string, userName: string, resetCode: string) {
    const context = {
      userName,
      link: 'API_URL' + resetCode,
    };

    const html = this.compileTemplate(ResetPasswordTemplate, context);
    return this.sendMail(email, 'Stratbook - Reset password', html);
  }

  /**
   * Compiles email template to html code.
   * @param mailTemplate imported template
   * @param context context object, which feeds into handlebars
   * @returns generated html code
   */
  private compileTemplate(mailTemplate: string, context: Record<string, unknown>) {
    const template = Handlebars.compile(mailTemplate);
    const mjmlTemplate = template(context);

    const { html } = mjml(mjmlTemplate, {
      // default
      fonts: {
        'Open Sans': 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700',
      },
      validationLevel: 'strict',
      keepComments: false,
    });

    return html;
  }
}
