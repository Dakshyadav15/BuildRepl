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
    <div>
      <h2>Dashboard</h2>
      <h3>Welcome, {user && user.name}</h3>

      <form onSubmit={onPostSubmit} style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '1rem 0'}}>
        <textarea placeholder="Create a post" value={text} onChange={(e) => setText(e.target.value)} rows="3" required></textarea>
        <button type="submit">Submit</button>
      </form>

      <div>
        <h3>Posts</h3>
        {posts.map((post) => (
          <div key={post._id} style={{border: '1px solid #ccc', padding: '1rem', margin: '0.5rem 0'}}>
            <p>{post.text}</p>
            <small>Posted by: {post.name}</small><br />
            {user && post.user === user._id && (
              <button onClick={() => deletePost(post._id)} style={{background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', marginTop: '0.5rem'}}>
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;