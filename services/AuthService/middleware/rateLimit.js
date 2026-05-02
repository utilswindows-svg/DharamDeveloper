const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const { redisClient } = require('../config/redis');

const sendRedisCommand = async (...args) => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  return redisClient.sendCommand(args);
};

const buildLimiter = (opts = {}) =>
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: opts.max || Number(process.env.RATE_LIMIT_MAX) || 100,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      sendCommand: sendRedisCommand,
      prefix: opts.prefix || 'rl:',
    }),
    message: { success: false, message: 'Too many requests, please try again later.' },
  });

module.exports = {
  generalLimiter: buildLimiter({ prefix: 'rl:gen:' }),
  authLimiter: buildLimiter({ prefix: 'rl:auth:', max: 20 }),
  otpLimiter: buildLimiter({ prefix: 'rl:otp:', max: 5 }),
};
