/**
 * Redis client with safe in-memory fallback so the service runs
 * even if Redis is not configured (dev only).
 */
let client;
const memory = new Map();

if (process.env.REDIS_URL) {
  const Redis = require("ioredis");
  client = new Redis(process.env.REDIS_URL, { lazyConnect: false, maxRetriesPerRequest: 3 });
  client.on("error", (e) => console.error("[redis]", e.message));
} else {
  console.warn("[redis] REDIS_URL not set — using in-memory store (dev only)");
  client = {
    async set(key, value, mode, ttl) {
      memory.set(key, value);
      if (mode === "EX" && ttl) setTimeout(() => memory.delete(key), ttl * 1000);
      return "OK";
    },
    async get(key) {
      return memory.has(key) ? memory.get(key) : null;
    },
    async del(key) {
      return memory.delete(key) ? 1 : 0;
    },
    async incr(key) {
      const v = (parseInt(memory.get(key) || "0", 10) || 0) + 1;
      memory.set(key, String(v));
      return v;
    },
    async expire(key, ttl) {
      if (memory.has(key)) {
        setTimeout(() => memory.delete(key), ttl * 1000);
        return 1;
      }
      return 0;
    },
  };
}

module.exports = client;