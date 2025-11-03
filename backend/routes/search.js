const express = require('express');
const router = express.Router();
const { searchPosts } = require('../utils/search');

// @route   GET api/search
// @desc    Search posts by query
// @access  Public (or Private with 'auth' middleware)
router.get('/', async (req, res) => {
  try {
    const query = req.query.q; // Get query from URL (e.g., /api/search?q=testing)
    const results = await searchPosts(query);
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
