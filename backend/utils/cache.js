import { createClient } from 'redis';

// Create Redis client (Do NOT connect here. Connection happens in server.js)
let redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});

// Handle Redis connection events (for debugging)
if (typeof redisClient.on === 'function') {
  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });
  redisClient.on('connect', () => {
    console.log('Redis Client Connected');
  });
}

export const setRedisClient = (client) => {
  redisClient = client;
};

export const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
};

export const getOrSetCache = async (key, cb, expiration = 3600) => {
  try {
    if (redisClient.isOpen === false) {
      console.warn('Redis client is not connected. Bypassing cache.');
      return await cb();
    }

    const cachedData = await redisClient.get(key);

    if (cachedData) {
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

export const invalidateCache = async (key) => {
  try {
    if (redisClient.isOpen) {
      await redisClient.del(key);
    }
  } catch (err) {
    console.error('Cache invalidation error:', err);
  }
};

export const invalidateCachePattern = async (pattern) => {
  try {
    if (redisClient.isOpen) {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    }
  } catch (err) {
    console.error('Cache pattern invalidation error:', err);
  }
};

export { redisClient };
