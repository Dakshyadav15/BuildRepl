import { jest } from '@jest/globals';
import { getOrSetCache, setRedisClient } from './cache.js';

// 1. Define the mock client methods FIRST.
const mockRedisClient = {
  get: jest.fn(),
  setEx: jest.fn(),
  on: jest.fn(),
  isOpen: true,
};

describe('Cache Utility', () => {
  let mockCallback;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCallback = jest.fn().mockResolvedValue({ data: 'fresh data' });
    mockRedisClient.get.mockResolvedValue(null);
    setRedisClient(mockRedisClient);
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
