import { jest } from '@jest/globals';
import request from 'supertest';

// Mock the search util BEFORE importing the app/router
const mockResults = [{ title: 'hello' }];
await jest.unstable_mockModule('../utils/search.js', () => ({
  searchPosts: jest.fn().mockResolvedValue(mockResults),
}));

const { default: app } = await import('../app.js');

describe('Search Routes', () => {
  it('GET /api/search returns results', async () => {
    const res = await request(app).get('/api/search?q=hello');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
