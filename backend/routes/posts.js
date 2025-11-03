const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');
const upload = require('../middleware/upload');
const { uploadImage } = require('../utils/imageUploader');
const cacheMiddleware = require('../middleware/cacheMiddleware');
const { invalidateCachePattern } = require('../utils/cache');

// @route   POST api/posts
router.post('/', [auth, upload], async (req, res) => {
  try {
    const { title, text } = req.body;
    const file = req.file;

    console.log('=== POST REQUEST DEBUG ===');
    console.log('Title:', title);
    console.log('Text:', text);
    console.log('File received:', file ? 'YES' : 'NO');

    let imageUrl = null;

    if (file) {
      console.log('Attempting to upload to Cloudinary...');
      try {
        imageUrl = await uploadImage(file.buffer);
        console.log('Upload successful! URL:', imageUrl);
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
    console.log('Post saved successfully!');

    // Invalidate posts cache after creating new post
    await invalidateCachePattern('posts:*');

    res.status(201).json(post);
  } catch (err) {
    console.error('=== ERROR CREATING POST ===');
    console.error('Error message:', err.message);
    console.error('Full error:', err);
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
    console.error(err.message);
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
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
