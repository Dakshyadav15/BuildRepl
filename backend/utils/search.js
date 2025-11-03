const Post = require('../models/Post');

/**
 * Searches posts using MongoDB Atlas Search.
 * @param {string} query - The search term.
 * @returns {Promise<Array>} - A promise that resolves to an array of posts.
 */
const searchPosts = async (query) => {
  // Don't hit the DB with an empty query
  if (!query || query.trim() === '') {
    return [];
  }

  try {
    // This is the $search aggregation pipeline
    // It requires a Search Index named "default" on your cluster
    const pipeline = [
      {
        $search: {
          index: 'default', // The name of the Atlas Search Index
          text: {
            query: query,
            path: {
              wildcard: '*' // Search all fields (title, text, etc.)
            },
            fuzzy: {} // Allow for small typos
          }
        }
      },
      {
        $limit: 10 // Limit to 10 results
      },
      {
        $project: { // Only return the fields we need
          title: 1,
          text: 1,
          imageUrl: 1,
          name: 1,
          date: 1
          // Exclude search score unless you want it
          // score: { $meta: "searchScore" } 
        }
      }
    ];

    const posts = await Post.aggregate(pipeline);
    return posts;

  } catch (err) {
    console.error('Error during search aggregation:', err.message);
    return [];
  }
};

module.exports = { searchPosts };