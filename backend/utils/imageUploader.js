// backend/utils/imageUploader.js
const { v2: cloudinary } = require('cloudinary');
const { Readable } = require('stream');

// Load environment variables
require('dotenv').config();

// Configure Cloudinary with your .env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Add this debug log to verify config is loaded
console.log('Cloudinary Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? '✓ Set' : '✗ Missing',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '✓ Set' : '✗ Missing',
});

/**
 * Uploads a file buffer to Cloudinary
 * @param {Buffer} buffer - The file data in memory
 * @returns {Promise<string>} A promise that resolves with the secure URL
 */
const uploadImage = (buffer) => {
  return new Promise((resolve, reject) => {
    // Create an upload stream
    const stream = cloudinary.uploader.upload_stream(
      { 
        resource_type: 'auto',
        folder: 'social-media-posts', // Optional: organize in folders
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }
        console.log('Cloudinary upload success:', result.secure_url);
        resolve(result.secure_url);
      }
    );

    // Pipe the buffer into the stream
    Readable.from(buffer).pipe(stream);
  });
};

module.exports = { uploadImage };