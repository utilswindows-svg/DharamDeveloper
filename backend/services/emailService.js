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

async function send2FAEmail({ to, otp, ttlSeconds, action }) {
  const transporter = getTransporter();
  const minutes = Math.round(ttlSeconds / 60);
  const verb = action === 'disable' ? 'disable' : 'enable';
  const subject = `Confirm ${verb} two-factor authentication`;
  const text = `Your verification code to ${verb} two-factor authentication is ${otp}. It expires in ${minutes} minutes.\n\nIf you did not request this change, please secure your account immediately.`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#ffffff;color:#111;">
      <h2 style="margin:0 0 12px;">Confirm 2FA ${verb}</h2>
      <p style="font-size:14px;color:#444;margin:0 0 16px;">Use the verification code below to ${verb} two-factor authentication on your account. This code expires in <b>${minutes} minutes</b>.</p>
      <div style="font-size:32px;font-weight:700;letter-spacing:8px;background:#f4f4f5;padding:16px 24px;border-radius:8px;text-align:center;">${otp}</div>
      <p style="font-size:12px;color:#888;margin-top:24px;">If you did not request this change, please secure your account immediately.</p>
    </div>`;
  const msg = { to, subject, text, html, from: process.env.EMAIL_FROM || process.env.SMTP_USER };
  if (!transporter) {
    console.log(`[DEV] 2FA OTP for ${to}: ${otp}`);
    return { mocked: true };
  }
  const info = await transporter.sendMail(msg);
  console.log(`📧 2FA OTP sent to ${to} (messageId=${info.messageId})`);
  return { messageId: info.messageId };
}

function buildLicenseEmail({ to, order }) {
  const subject = `Your ${order.productTitle} License Key`;
  const expiry = order.expiresAt ? new Date(order.expiresAt).toDateString() : 'N/A';
  const purchase = new Date(order.createdAt).toDateString();
  const text = `Thank you for your purchase!\n\nProduct: ${order.productTitle}\nLicense: ${order.licenseName}\nLicense Key: ${order.licenseKey}\nSeats: ${order.seats}\nPurchase Date: ${purchase}\nExpiry: ${expiry}\nOrder #: ${order.id}\nTotal: ${order.currency} ${order.total}\n\nKeep this email safe — you'll need the license key to activate the product.`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#ffffff;color:#111;">
      <h2 style="margin:0 0 8px;">Thank you for your purchase!</h2>
      <p style="font-size:14px;color:#444;margin:0 0 20px;">Your license key for <b>${order.productTitle}</b> is ready.</p>
      <div style="font-size:20px;font-weight:700;letter-spacing:2px;background:#f4f4f5;padding:16px 24px;border-radius:8px;text-align:center;font-family:monospace;">${order.licenseKey}</div>
      <table style="width:100%;margin-top:20px;font-size:13px;color:#333;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#777;">Product</td><td style="text-align:right;font-weight:600;">${order.productTitle}</td></tr>
        <tr><td style="padding:6px 0;color:#777;">License</td><td style="text-align:right;font-weight:600;">${order.licenseName}</td></tr>
        <tr><td style="padding:6px 0;color:#777;">Seats</td><td style="text-align:right;font-weight:600;">${order.seats}</td></tr>
        <tr><td style="padding:6px 0;color:#777;">Purchase Date</td><td style="text-align:right;">${purchase}</td></tr>
        <tr><td style="padding:6px 0;color:#777;">Expiry</td><td style="text-align:right;">${expiry}</td></tr>
        <tr><td style="padding:6px 0;color:#777;">Order #</td><td style="text-align:right;font-family:monospace;">${order.id}</td></tr>
        <tr><td style="padding:6px 0;color:#777;">Total</td><td style="text-align:right;font-weight:700;">${order.currency} ${order.total}</td></tr>
      </table>
      <p style="font-size:12px;color:#888;margin-top:24px;">Keep this email safe — you'll need the license key to activate the product. You can also view all your licenses anytime from your account dashboard.</p>
    </div>`;
  return { to, subject, text, html, from: process.env.EMAIL_FROM || process.env.SMTP_USER };
}

async function sendLicenseEmail({ to, order }) {
  const transporter = getTransporter();
  const msg = buildLicenseEmail({ to, order });
  if (!transporter) {
    console.log(`[DEV] License email for ${to}: ${order.licenseKey}`);
    return { mocked: true };
  }
  const info = await transporter.sendMail(msg);
  console.log(`📧 License email sent to ${to} (messageId=${info.messageId})`);
  return { messageId: info.messageId };
}

module.exports = { sendOtpEmail, sendLicenseEmail };
