// backend/routes/tests/auth.test.js

// We import 'request' from supertest for making API calls
import request from 'supertest';
// Import your Express app. Adjust the path!
// This path must go from auth.test.js back to your server.js (or app.js/index.js)
import app from '../server.js'; // <-- MIGHT NEED TO CHANGE

// Import your User model. Adjust the path!
import User from '../models/User.js'; // <-- MIGHT NEED TO CHANGE

// Make sure your paths are correct.
// Example: If server.js is in root, it's '../../server.js'
// Example: If User.js is in /models, it's '../../models/User.js'

describe('Auth Routes', () => {

  describe('POST /api/auth/register', () => {

    test('should register a new user successfully', async () => {
      // 1. Define the user data to send
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      // 2. Send the "fake" API request
      const response = await request(app)
        .post('/api/auth/register') // to this endpoint
        .send(newUser); // with this data

      // 3. Assert the HTTP response
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token'); // Check if a token is sent back

      // 4. Assert the Database (CRITICAL)
      // This proves the user was *actually* saved
      const userInDb = await User.findOne({ email: 'test@example.com' });
      expect(userInDb).toBeTruthy(); // Check that the user exists
      expect(userInDb.name).toBe('Test User');

      // BONUS: Check that the password was hashed
      expect(userInDb.password).not.toBe('password123');
    });

    test('should fail to register a user with a duplicate email', async () => {
      // 1. First, create a user in the database
      const user = new User({ 
        name: 'Existing User', 
        email: 'duplicate@example.com', 
        password: 'password123' 
      });
      await user.save();

      // 2. Try to register with the SAME email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Another User',
          email: 'duplicate@example.com',
          password: 'password456',
        });

      // 3. Assert the error response
      // Note: Your API might send a 400, 409, or 500. Adjust as needed.
      expect(response.statusCode).toBe(400); 
      // You can also check for a specific error message
      expect(response.body.msg).toBe('User already exists');
    });
  });

  // You can add a describe block for 'POST /api/auth/login' here as well

});