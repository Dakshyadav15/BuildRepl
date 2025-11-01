import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import AuthContext from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    api.get('/posts').then(res => setPosts(res.data)).catch(err => console.error(err));
  }, []);

  const onPostSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/posts', { text });
      setPosts([res.data, ...posts]);
      setText('');
    } catch (err) { console.error(err); }
  };

  const deletePost = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((post) => post._id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl font-bold">Dashboard</h2>
      <h3 className="text-xl text-gray-700 mb-6">Welcome, {user && user.name}</h3>

      {/* --- Create Post Form --- */}
      <form onSubmit={onPostSubmit} className="mb-8 p-6 bg-white rounded-lg shadow">
        <h4 className="text-lg font-semibold mb-3">Create a New Post</h4>
        <textarea
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="3"
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <button 
          type="submit"
          className="mt-3 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit Post
        </button>
      </form>
      {/* --- End Form --- */}

      {/* --- Posts List --- */}
      <div>
        <h3 className="text-2xl font-bold mb-4">Posts Feed</h3>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post._id} className="p-4 bg-white rounded-lg shadow">
              <p className="text-gray-800 mb-2">{post.text}</p>
              <div className="flex justify-between items-center">
                <small className="text-gray-500">Posted by: {post.name}</small>
                {user && post.user === user._id && (
                  <button 
                    onClick={() => deletePost(post._id)} 
                    className="px-3 py-1 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;