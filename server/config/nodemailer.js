import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',       // Gmail SMTP host
  port: 465,                    // Secure port for Gmail
  secure: true,                 // Use SSL
  auth: {
    user: process.env.SMTP_USER,      // Your Gmail address
    pass: process.env.SMTP_PASSWORD,  // 16-character App Password
  },
});

// Optional: verify connection before sending emails
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP connection failed:', error);
  } else {
    console.log('✅ SMTP connection successful and ready to send emails');
  }
});
export default transporter;