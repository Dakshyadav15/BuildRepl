// backend/test-setup.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

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
    const { redisClient } = require('./utils/cache');
    if (redisClient && redisClient.isOpen) {
      await redisClient.quit();
      console.log('Redis client closed');
    }
  } catch (err) {
    console.log('No Redis client to close');
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
