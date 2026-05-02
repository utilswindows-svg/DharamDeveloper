// Real email sender via Nodemailer SMTP. Falls back to console log if SMTP not configured.
const { getTransporter } = require('../config/mailer');

function buildOtpEmail({ to, otp, ttlSeconds }) {
  const minutes = Math.round(ttlSeconds / 60);
  const subject = 'Your password reset code';
  const text = `Your verification code is ${otp}. It expires in ${minutes} minutes.\n\nIf you did not request this, please ignore this email.`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#ffffff;color:#111;">
      <h2 style="margin:0 0 12px;">Password reset code</h2>
      <p style="font-size:14px;color:#444;margin:0 0 16px;">Use the verification code below to reset your password. This code expires in <b>${minutes} minutes</b>.</p>
      <div style="font-size:32px;font-weight:700;letter-spacing:8px;background:#f4f4f5;padding:16px 24px;border-radius:8px;text-align:center;">${otp}</div>
      <p style="font-size:12px;color:#888;margin-top:24px;">If you did not request a password reset, you can safely ignore this email.</p>
    </div>`;
  return { to, subject, text, html, from: process.env.EMAIL_FROM || process.env.SMTP_USER };
}

async function sendOtpEmail({ to, otp, ttlSeconds }) {
  const transporter = getTransporter();
  const msg = buildOtpEmail({ to, otp, ttlSeconds });
  if (!transporter) {
    console.log(`[DEV] Email OTP for ${to}: ${otp}`);
    return { mocked: true };
  }
  const info = await transporter.sendMail(msg);
  console.log(`📧 Email OTP sent to ${to} (messageId=${info.messageId})`);
  return { messageId: info.messageId };
}

module.exports = { sendOtpEmail };
