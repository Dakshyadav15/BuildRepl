// backend/utils/imageUploader.test.js
import { jest } from '@jest/globals';

// Mock the entire cloudinary module BEFORE importing the SUT
const v2Mock = {
  uploader: {
    upload_stream: jest.fn(),
  },
  config: jest.fn(),
};
await jest.unstable_mockModule('cloudinary', () => ({
  default: { v2: v2Mock },
  v2: v2Mock,
}));

const { v2: cloudinary } = await import('cloudinary');
const { uploadImage } = await import('./imageUploader.js');

describe('imageUploader Utility', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should upload a buffer and return a secure URL', async () => {
    // 1. Define a mock response from Cloudinary
    const mockUploadResponse = { secure_url: 'https://fake.url/image.jpg' };

    // 2. Configure the mock:
    // When 'upload_stream' is called, it will immediately
    // execute its callback with (null [for no error], mockUploadResponse)
    cloudinary.uploader.upload_stream.mockImplementation(
      (options, callback) => {
        callback(null, mockUploadResponse);
        // It must also return a mock stream object with an 'end' function
        return { end: jest.fn() };
      }
    );

    // 3. Create a fake file buffer
    const testBuffer = Buffer.from('fake image data');

    // 4. Run our function
    const result = await uploadImage(testBuffer);

    // 5. Assertions
    // Check that our mock 'upload_stream' was actually called
    expect(cloudinary.uploader.upload_stream).toHaveBeenCalled();
    // Check that our function returned the fake URL
    expect(result).toBe('https://fake.url/image.jpg');
  });

  it('should handle an upload error', async () => {
    // 1. Define a mock error
    const mockError = new Error('Cloudinary upload failed');

    // 2. Configure the mock to return an error
    cloudinary.uploader.upload_stream.mockImplementation(
      (options, callback) => {
        callback(mockError, null);
        return { end: jest.fn() };
      }
    );

    const testBuffer = Buffer.from('fake image data');

    // 3. Assertions
    // We expect the 'uploadImage' promise to be rejected
    await expect(uploadImage(testBuffer)).rejects.toThrow(
      'Cloudinary upload failed'
    );
    expect(cloudinary.uploader.upload_stream).toHaveBeenCalled();
  });
});
