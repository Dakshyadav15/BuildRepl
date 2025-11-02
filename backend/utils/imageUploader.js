const { v2: cloudinary } = require('cloudinary');
const { Readable } = require('stream');

// Configure Cloudinary with your .env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
      { resource_type: 'auto' }, // Automatically detect file type
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url); // Resolves with the URL
      }
    );

    // Pipe the buffer into the stream
    Readable.from(buffer).pipe(stream);
  });
};

// Use module.exports to match your other files
module.exports = { uploadImage };