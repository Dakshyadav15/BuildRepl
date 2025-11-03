import React, { useState, useContext } from 'react';
import axios from 'axios'; // Make sure you have 'axios' installed
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext'; // Adjust path if needed

const CreatePost = () => {
  // Use AuthContext to get the token for the request
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({ title: '', text: '' });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const { title, text } = formData;

  // Handle text input changes
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input changes
  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // 1. Create FormData to send text and file
    const data = new FormData();
    data.append('title', title);
    data.append('text', text);
    if (file) {
      data.append('image', file); // 'image' MUST match backend
    }

    try {
      // 2. Set headers for multipart/form-data and auth
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token, // Send your token
        },
      };

      // 3. Make the API call
      const res = await axios.post('/api/posts', data, config);

      // 4. Redirect to the new post's page
      navigate(`/posts/${res.data._id}`);
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      // You should add error handling for the user here
    }
  };

  return (
    <div className="flex justify-center mt-16">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <form onSubmit={onSubmit} className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Create New Post
          </h2>

          {/* Title Input */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              name="title" // E2E test: cy.get('input[name="title"]')
              type="text"
              value={title}
              onChange={onChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          {/* Text Input */}
          <div>
            <label
              htmlFor="text"
              className="block text-sm font-medium text-gray-700"
            >
              Text
            </label>
            <textarea
              id="text"
              name="text" // E2E test: cy.get('textarea[name="text"]')
              value={text}
              onChange={onChange}
              required
              rows="5"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          {/* File Input */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Cover Image
            </label>
            <input
              id="image"
              type="file"
              name="image" // E2E test: cy.get('input[type="file"][name="image"]')
              accept="image/*"
              onChange={onFileChange}
              className="mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
