const jwt = require('jsonwebtoken');
const signAccessToken = (p) => jwt.sign(p, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });
const signRefreshToken = (p) => jwt.sign(p, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' });
const verifyAccess = (t) => jwt.verify(t, process.env.JWT_SECRET);
const verifyRefresh = (t) => jwt.verify(t, process.env.JWT_REFRESH_SECRET);
module.exports = { signAccessToken, signRefreshToken, verifyAccess, verifyRefresh };
