import Post from '../models/Post.js';

/**
 * Searches posts using MongoDB Atlas Search.
 * @param {string} query - The search term.
 * @returns {Promise<Array>} - A promise that resolves to an array of posts.
 */
export const searchPosts = async (query) => {
  if (!query || query.trim() === '') {
    return [];
  }

  try {
    const pipeline = [
      {
        $search: {
          index: 'default',
          text: {
            query: query,
            path: {
              wildcard: '*',
            },
            fuzzy: {},
          },
        },
      },
      { $limit: 10 },
      {
        $project: {
          title: 1,
          text: 1,
          imageUrl: 1,
          name: 1,
          date: 1,
        },
      },
    ];

    const posts = await Post.aggregate(pipeline);
    return posts;
  } catch (err) {
    console.error('Error during search aggregation:', err.message);
    return [];
  }
};

export default { searchPosts };
