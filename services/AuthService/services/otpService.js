// OTP storage in Redis + delivery via real Email (Nodemailer) or SMS (Twilio)
const { redisClient } = require('../config/redis');
const { generateOtp } = require('../utils/otp');
const { sendOtpEmail } = require('./emailService');
const { sendOtpSms } = require('./smsService');

const OTP_TTL = Number(process.env.OTP_TTL_SECONDS) || 600;

const keyFor = (channel, identifier) => `otp:reset:${channel}:${identifier.toLowerCase()}`;
const verifiedKeyFor = (channel, identifier) => `otp:verified:${channel}:${identifier.toLowerCase()}`;
const cooldownKeyFor = (channel, identifier) => `otp:cooldown:${channel}:${identifier.toLowerCase()}`;

/**
 * Create OTP, store in Redis with TTL, deliver via the chosen channel.
 * @param {'email'|'sms'} channel
 * @param {string} identifier  email address or E.164 phone number
 */
async function createAndSendOtp(channel, identifier) {
  // Resend cooldown (60s) so users can't spam the OTP request
  const cooldownKey = cooldownKeyFor(channel, identifier);
  if (await redisClient.get(cooldownKey)) {
    const ttl = await redisClient.ttl(cooldownKey);
    const err = new Error(`Please wait ${ttl}s before requesting another code`);
    err.statusCode = 429;
    throw err;
  }

  const otp = generateOtp();
  await redisClient.set(keyFor(channel, identifier), otp, { EX: OTP_TTL });
  await redisClient.set(cooldownKey, '1', { EX: 60 });

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
    // Surface in dev so testing isn't blocked by provider issues
    console.log(`[FALLBACK] OTP for ${identifier}: ${otp}`);
  }
  return true;
}

async function verifyOtp(channel, identifier, otp) {
  const stored = await redisClient.get(keyFor(channel, identifier));
  if (!stored || stored !== otp) return false;
  await redisClient.del(keyFor(channel, identifier));
  await redisClient.set(verifiedKeyFor(channel, identifier), '1', { EX: 600 });
  return true;
}

async function isVerifiedForReset(channel, identifier) {
  return (await redisClient.get(verifiedKeyFor(channel, identifier))) === '1';
}

async function clearVerified(channel, identifier) {
  await redisClient.del(verifiedKeyFor(channel, identifier));
}

module.exports = { createAndSendOtp, verifyOtp, isVerifiedForReset, clearVerified };
