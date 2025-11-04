import express from 'express';
import auth from '../middleware/auth.js';
import Post from '../models/Post.js';
import User from '../models/User.js';
import upload from '../middleware/upload.js';
import { uploadImage } from '../utils/imageUploader.js';
import cacheMiddleware from '../middleware/cacheMiddleware.js';
import { invalidateCachePattern } from '../utils/cache.js';

const router = express.Router();

// @route   POST api/posts
router.post('/', [auth, upload], async (req, res) => {
  try {
    const { title, text } = req.body;
    const file = req.file;

    let imageUrl = null;

    if (file) {
      try {
        imageUrl = await uploadImage(file.buffer);
      } catch (uploadError) {
        console.error('Cloudinary upload failed:', uploadError);
        throw uploadError;
      }
    }

    const user = await User.findById(req.user.id).select('-password');

    const newPost = new Post({
      title: title,
      text: text,
      name: user.name,
      user: req.user.id,
      imageUrl: imageUrl,
    });

    const post = await newPost.save();

    // Invalidate posts cache after creating new post
    await invalidateCachePattern('posts:*');

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// @route   GET api/posts
// Apply cache middleware with 5 minute expiration
router.get('/', [auth, cacheMiddleware('posts', 300)], async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/posts/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await post.deleteOne();

    // Invalidate posts cache after deleting post
    await invalidateCachePattern('posts:*');

    res.json({ msg: 'Post removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

export default router;
