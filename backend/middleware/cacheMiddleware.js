// backend/middleware/cacheMiddleware.js
const { getOrSetCache } = require('../utils/cache');

/**
 * Cache middleware for API routes
 * @param {string} keyPrefix - Prefix for cache key
 * @param {number} expiration - Cache expiration in seconds (default: 3600)
 */
const cacheMiddleware = (keyPrefix, expiration = 3600) => {
  return async (req, res, next) => {
    // Generate cache key based on route and query params
    const cacheKey = `${keyPrefix}:${req.user?.id || 'all'}:${JSON.stringify(req.query)}`;

    try {
      const cachedData = await getOrSetCache(
        cacheKey,
        async () => {
          // This callback will be executed on cache miss
          // We'll capture the response data in the route handler
          return null;
        },
        expiration
      );

      if (cachedData) {
        // Cache hit - send cached data
        res.setHeader('X-Cache-Status', 'HIT');
        return res.json(cachedData);
      }

      // Cache miss - continue to route handler
      res.setHeader('X-Cache-Status', 'MISS');

      // Store original json method
      const originalJson = res.json.bind(res);

      // Override json method to cache the response
      res.json = function (data) {
        // Cache the data
        const { redisClient } = require('../utils/cache');
        redisClient
          .setEx(cacheKey, expiration, JSON.stringify(data))
          .catch((err) => console.error('Failed to cache response:', err));

        // Send the response
        return originalJson(data);
      };

      next();
    } catch (err) {
      console.error('Cache middleware error:', err);
      // On error, continue without caching
      res.setHeader('X-Cache-Status', 'ERROR');
      next();
    }
  };
};

module.exports = cacheMiddleware;
