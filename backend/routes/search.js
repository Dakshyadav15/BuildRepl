import express from 'express';
import { searchPosts } from '../utils/search.js';

const router = express.Router();

// @route   GET api/search
// @desc    Search posts by query
// @access  Public (or Private with 'auth' middleware)
router.get('/', async (req, res) => {
  try {
    const query = req.query.q;
    const results = await searchPosts(query);
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
