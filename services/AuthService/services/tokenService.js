const crypto = require('crypto');
const { redisClient } = require('../config/redis');
const { signAccessToken, signRefreshToken, verifyRefresh } = require('../utils/jwt');

const refreshKey = (userId, jti) => `refresh:${userId}:${jti}`;
const REFRESH_TTL = 7 * 24 * 60 * 60;

async function issueTokens(user) {
  const jti = crypto.randomUUID();
  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const refreshToken = signRefreshToken({ sub: user.id, jti });
  await redisClient.set(refreshKey(user.id, jti), '1', { EX: REFRESH_TTL });
  return { accessToken, refreshToken };
}

async function rotateRefresh(oldToken) {
  const decoded = verifyRefresh(oldToken);
  const exists = await redisClient.get(refreshKey(decoded.sub, decoded.jti));
  if (!exists) throw new Error('Refresh token revoked');
  await redisClient.del(refreshKey(decoded.sub, decoded.jti));
  return issueTokens({ id: decoded.sub, email: decoded.email });
}

async function revokeAll(userId) {
  for await (const key of redisClient.scanIterator({ MATCH: `refresh:${userId}:*` })) {
    await redisClient.del(key);
  }
}

module.exports = { issueTokens, rotateRefresh, revokeAll };
