import { jest } from '@jest/globals';

// Mock the Mongoose Post model module before importing the search util
const PostMock = { aggregate: jest.fn() };
await jest.unstable_mockModule('../models/Post.js', () => ({
  default: PostMock,
}));

const { searchPosts } = await import('../utils/search.js');

describe('Search Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the database aggregate function with the correct search query', async () => {
    const query = 'test post';
    const mockResults = [{ title: 'A post about testing' }];

    PostMock.aggregate.mockResolvedValue(mockResults);

    const results = await searchPosts(query);

    expect(PostMock.aggregate).toHaveBeenCalledTimes(1);

    const pipeline = PostMock.aggregate.mock.calls[0][0];
    expect(pipeline[0]).toHaveProperty('$search');
    expect(pipeline[0].$search.index).toBe('default');
    expect(pipeline[0].$search.text.query).toBe(query);
    expect(pipeline[0].$search.text.path).toEqual({ wildcard: '*' });

    expect(results).toEqual(mockResults);
  });

  it('should return an empty array for an empty query', async () => {
    const results = await searchPosts('');
    expect(PostMock.aggregate).not.toHaveBeenCalled();
    expect(results).toEqual([]);
  });
});
