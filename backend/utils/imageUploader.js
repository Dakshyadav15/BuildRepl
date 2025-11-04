// backend/utils/imageUploader.js
import cloudinaryPkg from 'cloudinary';
import { Readable } from 'node:stream';
import dotenv from 'dotenv';

const { v2: cloudinary } = cloudinaryPkg;

dotenv.config();

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
export const uploadImage = (buffer) => {
  return new Promise((resolve, reject) => {
    // Create an upload stream
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'social-media-posts', // Optional: organize in folders
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result || !result.secure_url) {
          return reject(
            new Error('Upload result was incomplete or missing URL.')
          );
        }
        resolve(result.secure_url);
      }
    );

    // Pipe the buffer into the stream
    Readable.from(buffer).pipe(stream);
  });
};

export default { uploadImage };
