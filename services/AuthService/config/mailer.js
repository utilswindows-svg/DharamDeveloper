// Nodemailer SMTP transporter — works with Gmail, SendGrid, Mailgun, SES SMTP, Brevo, etc.
const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.warn('⚠️  SMTP not configured — emails will be logged instead of sent');
    return null;
  }
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: String(process.env.SMTP_SECURE) === 'true', // true for 465
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
  return transporter;
}

async function verifyMailer() {
  const t = getTransporter();
  if (!t) return false;
  try { await t.verify(); console.log('✅ SMTP ready'); return true; }
  catch (err) { console.error('❌ SMTP verify failed:', err.message); return false; }
}

module.exports = { getTransporter, verifyMailer };
