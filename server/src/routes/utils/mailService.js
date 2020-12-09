const nodemailer = require('nodemailer');
const Email = require('email-templates');
const path = require('path');
const urljoin = require('url-join');
const { API_URL } = require('../../config');

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

const sendMail = async (to, token, name, isChange) => {
  const link = urljoin(API_URL, `/auth/confirmation/${token}`);
  try {
    const res = await email.send({
      template: path.join(__dirname, 'templates', isChange ? 'verifyChange' : 'verifyNew'),
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

module.exports.sendMail = sendMail;
