import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    if (this.configService.get<boolean>('debug.mailTransportDisabled')) {
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
    });
  }
}
