const nodemailer = require('nodemailer');
const Email = require('email-templates');
const path = require('path');

console.log(process.env.NODE_ENV);

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
    from: 'CS Stratbook <csstratbook@jhiller.me>',
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

const sendMail = async (to, token, name) => {
  const link =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:3000/auth/confirmation/${token}`
      : `https://csgo-stratbook.herokuapp.com/auth/confirmation/${token}`;
  try {
    const res = await email.send({
      template: path.join(__dirname, 'templates', 'verify'),
      message: {
        to,
      },
      locals: {
        name,
        link,
      },
    });
    console.log(
      'Successfully sent verification mail with id: ' + res.messageId
    );
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

module.exports.sendMail = sendMail;
