const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');

const sendEmail = async (recipient, subject, message) => {
  if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev') {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.NODEMAILER_USERNAME,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
    try {
      await transporter.sendMail({
        from: process.env.ADMIN_SENDER_EMAIL_ADDRESS,
        to: recipient,
        subject,
        text: message,
      });
      return true;
    } catch {
      return false;
    }
  } else {
    const message = {
      to: recipient,
      from: process.env.ADMIN_SENDER_EMAIL_ADDRESS,
      subject,
      text: message,
    };

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    try {
      await Promise.all([await sgMail.send(message)]);
      return true;
    } catch {
      return false;
    }
  }
};

module.exports = { sendEmail };
