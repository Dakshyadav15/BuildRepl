const mongoose = require('mongoose');
const path = require('path');
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Post = require('../models/Post');
const { uploadImage } = require('../utils/imageUploader');

// --- 1. MOCK DEPENDENCIES ---
const mockUserId = new mongoose.Types.ObjectId().toString();

// Mock the uploader utility
jest.mock('../utils/imageUploader');

// Mock the auth middleware
jest.mock('../middleware/auth', () => (req, res, next) => {
  req.user = { id: mockUserId }; // Use the valid ID
  next();
});

// --- 2. AUTH ROUTES TESTS ---
describe('Auth Routes', () => {
  // This test is here so the suite is not empty
  it('should fail to register a user with duplicate email', async () => {
    // Create a user in the DB
    await new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    }).save();

    // Try to register again with the same email
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another User',
        email: 'test@example.com',
        password: 'password456'
      });
    
    // Assuming your API correctly handles this
    expect(res.statusCode).toBe(400);
  });
});

// --- 3. POST ROUTES TESTS ---
describe('Post Routes', () => {

  // Create the mock user before each test in this suite
  beforeEach(async () => {
    // Ensure the user exists in the DB for User.findById()
    await User.updateOne(
      { _id: mockUserId },
      {
        $set: {
          name: 'Mock User',
          email: 'mock@user.com',
          password: 'mockpassword'
        }
      },
      { upsert: true } // Creates the user if it doesn't exist
    );
  });

  it('should create a new post with an uploaded image URL', async () => {
    // Mock the uploader to return a fake URL
    uploadImage.mockResolvedValue('http://mocked.url/new-image.jpg');

    // Send the request
    const response = await request(app)
      .post('/api/posts')
      .field('text', 'This is the post text.')
      .attach('image', path.join(__dirname, 'test-image.png'));

    // Assert
    expect(response.statusCode).toBe(201);
    expect(response.body.imageUrl).toBe('http://mocked.url/new-image.jpg');
    expect(response.body.text).toBe('This is the post text.');
    expect(response.body.user).toBe(mockUserId);

    // Assert Database
    const postInDb = await Post.findById(response.body._id);
    expect(postInDb.imageUrl).toBe('http://mocked.url/new-image.jpg');
  });
});