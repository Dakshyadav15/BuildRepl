const Post = require('../models/Post');
const { searchPosts } = require('../utils/search'); // This file doesn't exist yet

// Mock the Mongoose Post model
jest.mock('../models/Post', () => ({
  // We mock 'aggregate' because that's what MongoDB Atlas Search uses
  aggregate: jest.fn(), 
}));

describe('Search Utility', () => {

  beforeEach(() => {
    // Clear all mock history before each test
    jest.clearAllMocks();
  });

  it('should call the database aggregate function with the correct search query', async () => {
    const query = 'test post';
    const mockResults = [{ title: 'A post about testing' }];
    
    // Arrange: Make the mock function return our mock results
    Post.aggregate.mockResolvedValue(mockResults);

    // Act: Run the (not-yet-created) function
    const results = await searchPosts(query);

    // Assert 1: Was the database actually queried?
    expect(Post.aggregate).toHaveBeenCalledTimes(1);

    // Assert 2: Was it called with the correct '$search' pipeline?
    // This is the most important part of the test.
    const pipeline = Post.aggregate.mock.calls[0][0]; // Get the pipeline array
    expect(pipeline[0]).toHaveProperty('$search');
    expect(pipeline[0].$search.index).toBe('default'); // Assuming default index name
    expect(pipeline[0].$search.text.query).toBe(query);
    expect(pipeline[0].$search.text.path).toEqual({ wildcard: '*' }); // Search all text fields

    // Assert 3: Did it return the results?
    expect(results).toEqual(mockResults);
  });

  it('should return an empty array for an empty query', async () => {
    // Act: Run the function with an empty string
    const results = await searchPosts('');

    // Assert: The database should NOT be called
    expect(Post.aggregate).not.toHaveBeenCalled();
    expect(results).toEqual([]);
  });
});