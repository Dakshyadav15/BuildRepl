import app from './app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function resolveMongoUri() {
  if (process.env.USE_MEM_MONGO === '1' || process.env.NODE_ENV === 'test') {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    console.log('Using in-memory MongoDB');
    return uri;
  }
  return process.env.MONGO_URI;
}

async function start() {
  try {
    const mongoUri = await resolveMongoUri();
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected...');
    app.listen(PORT, () =>
      console.log(`Server started on port http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
