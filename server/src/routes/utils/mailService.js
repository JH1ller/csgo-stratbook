const nodemailer = require('nodemailer');

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

const sendMail = async (to, token) => {
  const link =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:3000/auth/confirmation/${token}`
      : `https://csgo-stratbook.herokuapp.com/auth/confirmation/${token}`;

  try {
    const mail = await transporter.sendMail({
      from: 'CS Stratbook <csstratbook@jhiller.me>',
      to: to,
      subject: 'Confirm your Email for CS Stratbook',
      text: `Click the following link to verify your email: ${link}`,
      html: `<b>Click the following link to verify your email:</b> <a href="${link}">${link}</a>`,
    });
    console.log('Email sent: ', mail.messageId);
  } catch (error) {
    console.log(error);
  }
};

module.exports.sendMail = sendMail;
