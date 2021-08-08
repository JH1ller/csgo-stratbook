import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Job } from 'bull';
import nodemailer, { Transporter } from 'nodemailer';
import { htmlToText } from 'html-to-text';
import Handlebars, { Exception } from 'handlebars';
import mjml from 'mjml';

import { MailSendJob } from './job/mail-send-job';

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

@Processor('mailer')
export class MailerProcessor {
  private readonly logger = new Logger(MailerProcessor.name);

  private readonly transportDisabled: boolean;

  private readonly transporter?: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transportDisabled = this.configService.get<boolean>('debug.mailTransportDisabled');
    if (this.transportDisabled) {
      this.logger.warn('Email transport is disabled');
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

    // crude verification check
    this.transporter
      .verify()
      .then(() => {
        this.logger.log('email transporter verification complete');
      })
      .catch((error) => {
        throw new Exception(`email transporter verification failed: ${error as string}`);
      });
  }

  @Process()
  public async handleSend(job: Job<MailSendJob>) {
    const { emailTo, subject, context, template } = job.data;

    const html = this.compileTemplate(template, context);
    if (this.transportDisabled) {
      Logger.debug(`Skip mail: ${emailTo} - ${subject}`);
      return;
    }

    const text = htmlToText(html);

    // see https://nodemailer.com/usage/
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const info = await this.transporter.sendMail({
      from: 'Stratbook <support@stratbook.live>',
      to: emailTo,
      subject,
      html,
      text,
    });

    console.log(info);
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
