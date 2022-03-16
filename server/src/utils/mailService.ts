import nodemailer from 'nodemailer';
import Email from 'email-templates';
import path from 'path';
import urljoin from 'url-join';
import { API_URL, APP_URL } from '@/config';

export enum MailTemplate {
  'VERIFY_NEW' = 'verifyNew',
  'VERIFY_CHANGE' = 'verifyChange',
  'RESET_PASSWORD' = 'resetPassword',
}

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false,
  tls: {
    ciphers: 'SSLv3',
  },
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PW,
  },
});

const email = new Email({
  message: {
    from: 'Stratbook <support@stratbook.live>',
  },
  send: true,
  transport: transporter,
  juice: true,
  juiceResources: {
    webResources: {
      relativeTo: path.join(__dirname, 'templates', 'css'),
    },
  },
});

export const sendMail = async (to: string, token: string, name: string, template: MailTemplate) => {
  const link =
    template === MailTemplate.RESET_PASSWORD
      ? urljoin(APP_URL, `/#/reset?token=${token}`)
      : urljoin(API_URL, `/auth/confirmation/${token}`);
  try {
    const res = await email.send({
      template: path.join(__dirname, 'templates', template),
      message: {
        to,
      },
      locals: {
        name,
        link,
      },
    });
    console.log('Successfully sent verification mail with id: ' + res.messageId);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
