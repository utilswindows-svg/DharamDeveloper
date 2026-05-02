// Real SMS sender via Twilio. Falls back to console log if Twilio not configured.
const { getTwilio } = require('../config/twilio');

async function sendOtpSms({ to, otp, ttlSeconds }) {
  const client = getTwilio();
  const minutes = Math.round(ttlSeconds / 60);
  const body = `Your verification code is ${otp}. Expires in ${minutes} minutes.`;
  if (!client) {
    console.log(`[DEV] SMS OTP for ${to}: ${otp}`);
    return { mocked: true };
  }
  const msg = await client.messages.create({
    to,
    from: process.env.TWILIO_FROM_NUMBER,
    body,
  });
  console.log(`📱 SMS OTP sent to ${to} (sid=${msg.sid})`);
  return { sid: msg.sid };
}

module.exports = { sendOtpSms };
