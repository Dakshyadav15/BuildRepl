// backend/middleware/cacheMiddleware.js
import { getOrSetCache, redisClient } from '../utils/cache.js';

/**
 * Cache middleware for API routes
 * @param {string} keyPrefix - Prefix for cache key
 * @param {number} expiration - Cache expiration in seconds (default: 3600)
 */
const cacheMiddleware = (keyPrefix, expiration = 3600) => {
  return async (req, res, next) => {
    const cacheKey = `${keyPrefix}:${req.user?.id || 'all'}:${JSON.stringify(req.query)}`;

    try {
      const cachedData = await getOrSetCache(
        cacheKey,
        async () => null, // capture later in overridden res.json
        expiration
      );

      if (cachedData) {
        res.setHeader('X-Cache-Status', 'HIT');
        return res.json(cachedData);
      }

      res.setHeader('X-Cache-Status', 'MISS');

      const originalJson = res.json.bind(res);

      res.json = function (data) {
        redisClient
          .setEx(cacheKey, expiration, JSON.stringify(data))
          .catch((err) => console.error('Failed to cache response:', err));

        return originalJson(data);
      };

      next();
    } catch (err) {
      console.error('Cache middleware error:', err);
      res.setHeader('X-Cache-Status', 'ERROR');
      next();
    }
  };
};

export default cacheMiddleware;
