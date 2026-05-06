const crypto = require('crypto');
const { signAccessToken, signRefreshToken, verifyRefresh } = require('../utils/jwt');

const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// In-memory refresh token store: Map<userId, Map<jti, expiresAt>>
const refreshStore = new Map();

const cleanup = setInterval(() => {
  const now = Date.now();
  for (const [uid, jtis] of refreshStore) {
    for (const [jti, exp] of jtis) if (exp < now) jtis.delete(jti);
    if (jtis.size === 0) refreshStore.delete(uid);
  }
}, 5 * 60_000);
if (cleanup.unref) cleanup.unref();

function storeRefresh(userId, jti) {
  if (!refreshStore.has(userId)) refreshStore.set(userId, new Map());
  refreshStore.get(userId).set(jti, Date.now() + REFRESH_TTL_MS);
}
function hasRefresh(userId, jti) {
  const jtis = refreshStore.get(userId);
  if (!jtis) return false;
  const exp = jtis.get(jti);
  if (!exp) return false;
  if (exp < Date.now()) { jtis.delete(jti); return false; }
  return true;
}
function deleteRefresh(userId, jti) {
  refreshStore.get(userId)?.delete(jti);
}

async function issueTokens(user) {
  const jti = crypto.randomUUID();
  const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role || 'user' });
  const refreshToken = signRefreshToken({ sub: user.id, jti, role: user.role || 'user' });
  storeRefresh(user.id, jti);
  return { accessToken, refreshToken };
}

async function rotateRefresh(oldToken) {
  const decoded = verifyRefresh(oldToken);
  if (!hasRefresh(decoded.sub, decoded.jti)) throw new Error('Refresh token revoked');
  deleteRefresh(decoded.sub, decoded.jti);
  return issueTokens({ id: decoded.sub, email: decoded.email, role: decoded.role });
}

async function revokeAll(userId) {
  refreshStore.delete(userId);
}

module.exports = { issueTokens, rotateRefresh, revokeAll };
