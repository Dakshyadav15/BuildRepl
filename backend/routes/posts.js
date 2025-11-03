const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

// Import Multer middleware and Cloudinary uploader
const upload = require('../middleware/upload');
const { uploadImage } = require('../utils/imageUploader');

// @route   POST api/posts
router.post('/', [auth, upload], async (req, res) => {
  try {
    // Get both title and text from request body
    const { title, text } = req.body;
    const file = req.file;

    console.log('=== POST REQUEST DEBUG ===');
    console.log('Title:', title);
    console.log('Text:', text);
    console.log('File received:', file ? 'YES' : 'NO');
    if (file) {
      console.log('File details:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      });
    }

    let imageUrl = null;

    // Upload image if file exists
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

    // Create the new post with title
    const newPost = new Post({
      title: title,  // ADD THIS
      text: text,
      name: user.name,
      user: req.user.id,
      imageUrl: imageUrl,
    });
    
    const post = await newPost.save();
    console.log('Post saved successfully!');
    res.json(post);

  } catch (err) {
    console.error('=== ERROR CREATING POST ===');
    console.error('Error message:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// @route   GET api/posts
router.get('/', auth, async (req, res) => {
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
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;