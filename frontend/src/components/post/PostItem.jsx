import React from 'react';
import { Link } from 'react-router-dom';

// 'post' is passed as a prop from your post list
const PostItem = ({ post }) => {
  return (
    <div className="p-4 my-4 bg-white rounded-lg shadow-md">
      {/* --- THIS IS THE NEW CODE --- */}
      {/* Check if post.imageUrl exists, and if so, display it */}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          // E2E test: cy.get('img.post-cover-image')
          className="post-cover-image w-full h-auto rounded-md mb-4"
        />
      )}
      {/* --- END NEW CODE --- */}

      <h3 className="text-xl font-bold">
        <Link to={`/posts/${post._id}`}>{post.title}</Link>
      </h3>
      <p className="text-gray-600 mb-2">by {post.name}</p>
      <p className="text-gray-800">{post.text.substring(0, 150)}...</p>
    </div>
  );
};

export default PostItem;
