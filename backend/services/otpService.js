// OTP storage in memory + delivery via Email (Nodemailer) or SMS (Twilio)
const { generateOtp } = require('../utils/otp');
const { sendOtpEmail } = require('./emailService');
const { sendOtpSms } = require('./smsService');

const OTP_TTL = Number(process.env.OTP_TTL_SECONDS) || 600;

const keyFor = (channel, id) => `otp:reset:${channel}:${id.toLowerCase()}`;
const verifiedKeyFor = (channel, id) => `otp:verified:${channel}:${id.toLowerCase()}`;
const cooldownKeyFor = (channel, id) => `otp:cooldown:${channel}:${id.toLowerCase()}`;

const store = new Map();
const setEx = (k, v, ttl) => store.set(k, { value: v, expiresAt: Date.now() + ttl * 1000 });
const getKey = (k) => {
  const e = store.get(k);
  if (!e) return null;
  if (e.expiresAt < Date.now()) { store.delete(k); return null; }
  return e.value;
};
const ttlKey = (k) => {
  const e = store.get(k);
  if (!e) return -2;
  return Math.max(0, Math.ceil((e.expiresAt - Date.now()) / 1000));
};
const delKey = (k) => store.delete(k);

const cleanup = setInterval(() => {
  const now = Date.now();
  for (const [k, v] of store) if (v.expiresAt < now) store.delete(k);
}, 60_000);
if (cleanup.unref) cleanup.unref();

async function createAndSendOtp(channel, identifier) {
  const cooldownKey = cooldownKeyFor(channel, identifier);
  if (getKey(cooldownKey)) {
    const ttl = ttlKey(cooldownKey);
    const err = new Error(`Please wait ${ttl}s before requesting another code`);
    err.statusCode = 429;
    throw err;
  }

  const otp = generateOtp();
  setEx(keyFor(channel, identifier), otp, OTP_TTL);
  setEx(cooldownKey, '1', 60);

  try {
    if (channel === 'email') {
      await sendOtpEmail({ to: identifier, otp, ttlSeconds: OTP_TTL });
    } else if (channel === 'sms') {
      await sendOtpSms({ to: identifier, otp, ttlSeconds: OTP_TTL });
    } else {
      throw new Error(`Unsupported OTP channel: ${channel}`);
    }
  } catch (err) {
    console.error(`OTP delivery failed (${channel}):`, err.message);
    console.log(`[FALLBACK] OTP for ${identifier}: ${otp}`);
  }
  return true;
}

async function verifyOtp(channel, identifier, otp) {
  const stored = getKey(keyFor(channel, identifier));
  if (!stored || stored !== otp) return false;
  delKey(keyFor(channel, identifier));
  setEx(verifiedKeyFor(channel, identifier), '1', 600);
  return true;
}

async function isVerifiedForReset(channel, identifier) {
  return getKey(verifiedKeyFor(channel, identifier)) === '1';
}

async function clearVerified(channel, identifier) {
  delKey(verifiedKeyFor(channel, identifier));
}

module.exports = { createAndSendOtp, verifyOtp, isVerifiedForReset, clearVerified };
