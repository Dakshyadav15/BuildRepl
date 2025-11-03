// 1. Define the mock client methods FIRST.
const mockRedisClient = {
  get: jest.fn(),
  setEx: jest.fn(),
  on: jest.fn(), // Added the required method
  isOpen: true,
};

// Define the factory function.
const mockRedisFactory = () => mockRedisClient;

// 2. Mock the 'redis' module using the factory.
jest.mock('redis', () => ({
  createClient: mockRedisFactory,
  connect: jest.fn().mockResolvedValue(true), 
}));

// We use requireActual to import the real code safely.
const { getOrSetCache } = jest.requireActual('./cache');

// 3. Mock the redisClient export to ensure the implementation uses our mock methods.
jest.mock('./cache', () => {
    const originalModule = jest.requireActual('./cache');
    return {
        ...originalModule,
        redisClient: mockRedisClient, 
    };
});

describe('Cache Utility', () => {
  let mockCallback;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCallback = jest.fn().mockResolvedValue({ data: 'fresh data' });
    mockRedisClient.get.mockResolvedValue(null);
  });

  it('should return fresh data on cache miss and store it', async () => {
    const key = 'test:cache:miss';
    const result = await getOrSetCache(key, mockCallback, 60);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockRedisClient.setEx).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ data: 'fresh data' });
  });

  it('should return cached data on cache hit without calling callback', async () => {
    const key = 'test:cache:hit';
    const cachedData = JSON.stringify({ data: 'cached data' });
    
    mockRedisClient.get.mockResolvedValue(cachedData); 

    const result = await getOrSetCache(key, mockCallback, 60);

    expect(mockCallback).not.toHaveBeenCalled();
    expect(mockRedisClient.setEx).not.toHaveBeenCalled();
    expect(result).toEqual({ data: 'cached data' }); 
  });
  
  it('should call callback and skip setEx on redis error', async () => {
    const key = 'test:cache:error';
    mockRedisClient.get.mockRejectedValue(new Error('Simulated Redis failure'));
    
    const result = await getOrSetCache(key, mockCallback, 60); 
    
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockRedisClient.setEx).not.toHaveBeenCalled(); 
    expect(result).toEqual({ data: 'fresh data' });
  });
});