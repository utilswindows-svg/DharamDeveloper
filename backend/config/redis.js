const { createClient } = require('redis');
require('dotenv').config();
const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500),
  },
});
redisClient.on('error', (err) => console.error('Redis error:', err));
redisClient.on('end', () => console.warn('Redis connection closed'));
redisClient.on('ready', () => console.log('✅ Redis client ready'));

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log('✅ Redis connected');
  }
};
module.exports = { redisClient, connectRedis };
