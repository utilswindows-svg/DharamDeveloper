const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const redis = require("../config/redis");

const ACCESS_SECRET = process.env.JWT_SECRET;
const ACCESS_TTL = process.env.JWT_EXPIRES_IN || "15m";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const REFRESH_TTL = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60;

function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    ACCESS_SECRET,
    { expiresIn: ACCESS_TTL }
  );
}

async function signRefreshToken(user) {
  const jti = crypto.randomUUID();
  const token = jwt.sign({ sub: user.id, jti }, REFRESH_SECRET, { expiresIn: REFRESH_TTL });
  await redis.set(`refresh:${user.id}:${jti}`, "1", "EX", REFRESH_TTL_SECONDS);
  return token;
}

async function rotateRefreshToken(oldToken) {
  const payload = jwt.verify(oldToken, REFRESH_SECRET);
  const exists = await redis.get(`refresh:${payload.sub}:${payload.jti}`);
  if (!exists) throw new Error("Refresh token revoked or expired");
  await redis.del(`refresh:${payload.sub}:${payload.jti}`);
  return payload;
}

async function revokeRefreshToken(token) {
  try {
    const payload = jwt.verify(token, REFRESH_SECRET);
    await redis.del(`refresh:${payload.sub}:${payload.jti}`);
  } catch {
    /* ignore */
  }
}

function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
  verifyAccessToken,
};