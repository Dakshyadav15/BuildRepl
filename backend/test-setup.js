// backend/test-setup.js
// Use this if you don't have "type": "module"
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
// ... (rest of the file is the same) ...

let mongoServer; // This will be our in-memory server instance

// 'beforeAll' runs once before all tests
beforeAll(async () => {
  // Start the in-memory server
  mongoServer = await MongoMemoryServer.create();
  // Get the connection string
  const mongoUri = mongoServer.getUri();

  // Connect mongoose to the in-memory database
  await mongoose.connect(mongoUri);
});

// 'afterAll' runs once after all tests are finished
afterAll(async () => {
  // Disconnect mongoose
  await mongoose.disconnect();
  // Stop the in-memory server
  await mongoServer.stop();
});

// 'afterEach' runs after each individual test
afterEach(async () => {
  // Clean up the database between tests
  // This ensures every test starts with a fresh, empty DB
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});