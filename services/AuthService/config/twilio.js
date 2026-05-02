// Twilio SMS client (lazy init so the app still boots without SMS configured)
require('dotenv').config();
let client = null;

function getTwilio() {
  if (client) return client;
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token || !sid.startsWith('AC')) {
    console.warn('⚠️  Twilio not configured — SMS will be logged instead of sent');
    return null;
  }
  // Require lazily to avoid hard dependency at boot if someone removes the package
  const twilio = require('twilio');
  client = twilio(sid, token);
  return client;
}

module.exports = { getTwilio };
