const nodemailer = require('nodemailer');

const pug = require('pug');

async function sendEmail(user, url, type) {
  const subject = type === 'welcome' ? 'Welcome Email' : 'Password Reset Email';
  const html = pug.renderFile(`${__dirname}/../../views/email/${type}.pug`, {
    firstName: user.name,
    url: url,
  });

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
    to: user.email, // list of receivers
    subject: subject, // Subject line
    text: `This is the password reset link ${url} (valid 10 min)`, // plain text body
    html: `${html}`,
  });
}

module.exports = sendEmail;
