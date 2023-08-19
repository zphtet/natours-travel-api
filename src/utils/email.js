const nodemailer = require('nodemailer');

async function sendEmail(option) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: 'zph@gmail.com', // sender address
    to: option.email, // list of receivers
    subject: option.subject, // Subject line
    text: option.info, // plain text body
  });
}

module.exports =  sendEmail;
