const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

// --- NEW IMPORTS ---
// 1. Import your Multer middleware (you will create this next)
const upload = require('../middleware/upload');
// 2. Import your Cloudinary uploader utility
const { uploadImage } = require('../utils/imageUploader');
// --- END NEW IMPORTS ---


// @route   POST api/posts
// --- MODIFIED ---
// 3. Add the 'upload' middleware here
router.post('/', [auth, upload], async (req, res) => {
// --- END MODIFIED ---

  try {
    // 4. Your text fields are now in req.body
    const { text } = req.body;
    // Your file (if it exists) is in req.file
    const file = req.file;

    let imageUrl = null; // Default to no image

    // 5. Check if a file was uploaded
    if (file) {
      // Upload the file's buffer to Cloudinary
      imageUrl = await uploadImage(file.buffer);
    }
    
    const user = await User.findById(req.user.id).select('-password');

    // 6. Create the new post, now with an imageUrl
    const newPost = new Post({
      text: text,
      name: user.name,
      user: req.user.id,
      imageUrl: imageUrl, // <-- Add the URL
    });
    
    const post = await newPost.save();
    res.json(post);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
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
