const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    transporter = nodemailer.createTransport({
      jsonTransport: true,
    });
  }

  return transporter;
}

async function sendEmail({ to, subject, html }) {
  try {
    const from = process.env.SMTP_FROM || 'noreply@medwell.ma';
    const info = await getTransporter().sendMail({ from, to, subject, html });
    if (info.messageId) {
      console.log(`[EMAIL SIMULATED] To: ${to} | Subject: ${subject}`);
    }
    return info;
  } catch (err) {
    console.warn('[EMAIL] Failed to send:', err.message);
    return null;
  }
}

async function sendWelcomeEmail(user) {
  return sendEmail({
    to: user.email,
    subject: 'Welcome to Medical Wellness',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 30px 0;">
          <h1 style="color: #d4af37; font-family: 'Cormorant Garamond', serif; font-size: 28px;">Medical Wellness</h1>
        </div>
        <div style="background: #ffffff; border-radius: 16px; padding: 30px; border: 1px solid #e8e4dc;">
          <h2 style="color: #1a1a1a; font-size: 22px;">Welcome, ${user.first_name}!</h2>
          <p style="color: #5a5a5a; line-height: 1.6;">Thank you for joining Medical Wellness. Your digital membership card is now active.</p>
          <p style="color: #5a5a5a; line-height: 1.6;">Your member ID: <strong style="color: #d4af37;">${user.unique_id || ''}</strong></p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" style="background: #d4af37; color: white; padding: 12px 32px; border-radius: 50px; text-decoration: none; font-weight: 600;">Access My Portal</a>
          </div>
        </div>
        <div style="text-align: center; padding: 20px; color: #9a9a9a; font-size: 12px;">
          &copy; ${new Date().getFullYear()} Medical Wellness. All rights reserved.
        </div>
      </div>
    `,
  });
}

async function sendPaymentConfirmationEmail(user, payment) {
  if (!user.email) return null;
  return sendEmail({
    to: user.email,
    subject: 'Payment Confirmation - Medical Wellness',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 30px 0;">
          <h1 style="color: #d4af37; font-family: 'Cormorant Garamond', serif; font-size: 28px;">Medical Wellness</h1>
        </div>
        <div style="background: #ffffff; border-radius: 16px; padding: 30px; border: 1px solid #e8e4dc;">
          <h2 style="color: #1a1a1a; font-size: 22px;">Payment Confirmed</h2>
          <p style="color: #5a5a5a; line-height: 1.6;">Dear ${user.first_name}, your payment of <strong style="color: #d4af37;">${parseFloat(payment.amount).toLocaleString()} ${payment.currency}</strong> has been processed successfully.</p>
          <p style="color: #5a5a5a; line-height: 1.6;">Reference: <strong>${payment.reference}</strong></p>
        </div>
        <div style="text-align: center; padding: 20px; color: #9a9a9a; font-size: 12px;">
          &copy; ${new Date().getFullYear()} Medical Wellness
        </div>
      </div>
    `,
  });
}

async function sendPasswordResetEmail(user, code) {
  if (!user.email) return null;
  return sendEmail({
    to: user.email,
    subject: 'Password Reset - Medical Wellness',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 30px 0;">
          <h1 style="color: #d4af37; font-family: 'Cormorant Garamond', serif; font-size: 28px;">Medical Wellness</h1>
        </div>
        <div style="background: #ffffff; border-radius: 16px; padding: 30px; border: 1px solid #e8e4dc;">
          <h2 style="color: #1a1a1a; font-size: 22px;">Password Reset Request</h2>
          <p style="color: #5a5a5a; line-height: 1.6;">Use the code below to reset your password. This code expires in 5 minutes.</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; letter-spacing: 8px; font-weight: 700; color: #d4af37;">${code}</span>
          </div>
        </div>
        <div style="text-align: center; padding: 20px; color: #9a9a9a; font-size: 12px;">
          &copy; ${new Date().getFullYear()} Medical Wellness
        </div>
      </div>
    `,
  });
}

module.exports = { sendWelcomeEmail, sendPaymentConfirmationEmail, sendPasswordResetEmail };
