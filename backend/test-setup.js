// backend/test-setup.js (ESM)
import { jest } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer;

// Increase timeout for hooks
jest.setTimeout(10000);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  // Close Redis connection if it exists
  try {
    const { default: cacheUtils } = await import('./utils/cache.js');
    const { redisClient } = cacheUtils || {};
    if (redisClient && redisClient.isOpen) {
      await redisClient.quit();
    }
  } catch (err) {
    // ignore
  }

  // Disconnect mongoose
  await mongoose.disconnect();
  // Stop the in-memory server
  await mongoServer.stop();
}, 10000); // 10 second timeout

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
