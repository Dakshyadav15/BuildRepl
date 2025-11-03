const redis = require('redis');

// Create Redis client (Do NOT connect here. Connection happens in server.js)
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
});

// Handle Redis connection events (for debugging)
// FIX: Check if the 'on' method exists before calling it, bypassing the crash in Jest.
if (typeof redisClient.on === 'function') {
  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  redisClient.on('connect', () => {
    console.log('Redis Client Connected');
  });
}

// We expose the client and the connection function so server.js can start it.
const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
};

/**
 * Get data from cache or set it if not exists
 */
const getOrSetCache = async (key, cb, expiration = 3600) => {
  try {
    if (redisClient.isOpen === false) {
      console.warn('Redis client is not connected. Bypassing cache.');
      return await cb();
    }

    const cachedData = await redisClient.get(key);

    if (cachedData) {
      console.log(`Cache HIT for key: ${key}`);
      return JSON.parse(cachedData);
    }

    const freshData = await cb();
    await redisClient.setEx(key, expiration, JSON.stringify(freshData));

    return freshData;
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Cache error:', err);
    }
    return await cb();
  }
};

/**
 * Invalidate (delete) cache by key
 */
const invalidateCache = async (key) => {
  try {
    if (redisClient.isOpen) {
      await redisClient.del(key);
      console.log(`Cache invalidated for key: ${key}`);
    }
  } catch (err) {
    console.error('Cache invalidation error:', err);
  }
};

/**
 * Invalidate cache by pattern
 */
const invalidateCachePattern = async (pattern) => {
  try {
    if (redisClient.isOpen) {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
        console.log(
          `Cache invalidated for pattern: ${pattern}, keys: ${keys.length}`
        );
      }
    }
  } catch (err) {
    console.error('Cache pattern invalidation error:', err);
  }
};

module.exports = {
  redisClient,
  connectRedis,
  getOrSetCache,
  invalidateCache, // Correctly defined and exported
  invalidateCachePattern, // Correctly defined and exported
};
