import nodemailer from "nodemailer";

import dotenv from 'dotenv';

dotenv.config();

// Check if email is enabled
const isEmailEnabled = process.env.EMAIL_ENABLED !== 'false';

let transporter = null;

if (isEmailEnabled) {
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
    // tls: {
    //   rejectUnauthorized: false,
    // },
});
} else {
  console.log('📧 Email service is disabled (development mode)');
}

const sendEmail = async (options) => {
  if (!isEmailEnabled || !transporter) {
    console.log('📧 Email not sent (disabled in development):', options.subject);
    return { messageId: 'email-disabled' };
  }
  return await transporter.sendMail(options);
};

export default {
  transporter,
  sendEmail,
  isEmailEnabled,
};