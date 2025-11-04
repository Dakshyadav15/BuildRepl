import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import request from 'supertest';
import User from '../models/User.js';
import Post from '../models/Post.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- 1. MOCK DEPENDENCIES ---
const mockUserId = new mongoose.Types.ObjectId().toString();

// Mock modules BEFORE importing app/router
await jest.unstable_mockModule('../middleware/auth.js', () => ({
  default: (req, res, next) => {
    req.user = { id: mockUserId };
    next();
  },
}));

await jest.unstable_mockModule('../utils/imageUploader.js', () => ({
  uploadImage: jest.fn(),
}));

const { default: app } = await import('../app.js');
const { uploadImage } = await import('../utils/imageUploader.js');

// --- 2. AUTH ROUTES TESTS ---
describe('Auth Routes', () => {
  it('should fail to register a user with duplicate email', async () => {
    await new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    }).save();

    const res = await request(app).post('/api/auth/register').send({
      name: 'Another User',
      email: 'test@example.com',
      password: 'password456',
    });

    expect(res.statusCode).toBe(400);
  });
});

// --- 3. POST ROUTES TESTS ---
describe('Post Routes', () => {
  beforeEach(async () => {
    await User.updateOne(
      { _id: mockUserId },
      {
        $set: {
          name: 'Mock User',
          email: 'mock@user.com',
          password: 'mockpassword',
        },
      },
      { upsert: true }
    );
  });

  it('should create a new post with an uploaded image URL', async () => {
    uploadImage.mockResolvedValue('http://mocked.url/new-image.jpg');

    const response = await request(app)
      .post('/api/posts')
      .field('title', 'Test Post Title')
      .field('text', 'This is the post text.')
      .attach('image', path.join(__dirname, 'test-image.png'));

    expect(response.statusCode).toBe(201);
    expect(response.body.imageUrl).toBe('http://mocked.url/new-image.jpg');
    expect(response.body.title).toBe('Test Post Title');
    expect(response.body.text).toBe('This is the post text.');
    expect(response.body.user).toBe(mockUserId);

    const postInDb = await Post.findById(response.body._id);
    expect(postInDb.imageUrl).toBe('http://mocked.url/new-image.jpg');
  });
});
