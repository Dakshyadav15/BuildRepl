import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import AuthContext from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  // --- UPDATED STATE FOR POST CREATION ---
  const [formData, setFormData] = useState({ title: '', text: '' });
  const [file, setFile] = useState(null);
  const { title, text } = formData;

  useEffect(() => {
    // Fetch all posts when the component loads
    api
      .get('/posts')
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Handler for text/title input changes
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handler for file input changes
  const onFileChange = (e) => setFile(e.target.files[0]);

  const onPostSubmit = async (e) => {
    e.preventDefault();

    // 1. Prepare FormData (required for file upload)
    const data = new FormData();
    data.append('title', title);
    data.append('text', text);
    if (file) {
      data.append('image', file); // 'image' must match backend middleware name
    }

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      // 2. Post the FormData
      const res = await api.post('/posts', data, config);

      // Update local state with the new post
      setPosts([res.data, ...posts]);

      // Clear form fields
      setFormData({ title: '', text: '' });
      setFile(null);
    } catch (err) {
      console.error(err);
    }
  };

  const deletePost = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((post) => post._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl font-bold">Dashboard</h2>
      <h3 className="text-xl text-gray-700 mb-6">
        Welcome, {user && user.name}
      </h3>

      {/* --- Create Post Form --- */}
      <form
        onSubmit={onPostSubmit}
        className="mb-8 p-6 bg-white rounded-lg shadow"
      >
        <h4 className="text-lg font-semibold mb-3">
          Create a New Post (Image Ready)
        </h4>

        {/* Title Input */}
        <input
          type="text"
          name="title" // E2E selector
          placeholder="Post Title"
          value={title}
          onChange={onChange}
          required
          className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Text Area */}
        <textarea
          name="text" // E2E selector
          placeholder="What's on your mind?"
          value={text}
          onChange={onChange}
          rows="3"
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>

        {/* Image Input */}
        <label
          htmlFor="image-upload"
          className="block text-sm font-medium text-gray-700 mb-2 mt-3"
        >
          Cover Image (Optional)
        </label>
        <input
          id="image-upload"
          type="file"
          name="image" // E2E selector
          accept="image/*"
          onChange={onFileChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />

        <button
          type="submit"
          className="mt-3 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit Post
        </button>
      </form>

      {/* --- Posts List (Display Image) --- */}
      <div>
        <h3 className="text-2xl font-bold mb-4">Posts Feed</h3>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post._id} className="p-4 bg-white rounded-lg shadow">
              {/* --- IMAGE DISPLAY --- */}
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.title || 'Post Image'}
                  className="post-cover-image w-full h-auto rounded-md mb-3" // E2E selector
                />
              )}
              {/* ----------------------- */}

              <h4 className="text-lg font-semibold mb-1">{post.title}</h4>
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
