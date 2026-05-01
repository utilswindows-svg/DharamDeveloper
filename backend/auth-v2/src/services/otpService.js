const crypto = require("crypto");
const bcrypt = require("bcrypt");
const redis = require("../config/redis");

const TTL = parseInt(process.env.OTP_TTL_SECONDS || "600", 10);
const LEN = parseInt(process.env.OTP_LENGTH || "6", 10);
const MAX_ATTEMPTS = parseInt(process.env.OTP_MAX_ATTEMPTS || "5", 10);

function generateOtp() {
  const max = 10 ** LEN;
  const n = crypto.randomInt(0, max);
  return n.toString().padStart(LEN, "0");
}

const key = (purpose, identifier) => `otp:${purpose}:${identifier.toLowerCase()}`;
const attemptsKey = (purpose, identifier) => `otp:attempts:${purpose}:${identifier.toLowerCase()}`;

async function createOtp(purpose, identifier) {
  const code = generateOtp();
  const hash = await bcrypt.hash(code, 10);
  await redis.set(key(purpose, identifier), hash, "EX", TTL);
  await redis.del(attemptsKey(purpose, identifier));
  return { code, ttl: TTL };
}

async function verifyOtp(purpose, identifier, code) {
  const k = key(purpose, identifier);
  const ak = attemptsKey(purpose, identifier);
  const stored = await redis.get(k);
  if (!stored) return { ok: false, reason: "expired" };

  const attempts = await redis.incr(ak);
  if (attempts === 1) await redis.expire(ak, TTL);
  if (attempts > MAX_ATTEMPTS) {
    await redis.del(k);
    return { ok: false, reason: "too_many_attempts" };
  }

  const match = await bcrypt.compare(code, stored);
  if (!match) return { ok: false, reason: "invalid" };

  await redis.del(k);
  await redis.del(ak);
  return { ok: true };
}

module.exports = { createOtp, verifyOtp };