import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import CreatePost from './components/post/CreatePost';
import PostItem from './components/post/PostItem';

// --- 1. IMPORT THE NEW SEARCH COMPONENT ---
import Search from './components/search/Search';

const App = () => {
  return (
    <AuthProvider>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: 'auto', padding: '1rem' }}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                {' '}
                <Dashboard />{' '}
              </PrivateRoute>
            }
          />
          <Route
            path="/create-post"
            element={
              <PrivateRoute>
                {' '}
                <CreatePost />{' '}
              </PrivateRoute>
            }
          />
          <Route
            path="/posts/:id"
            element={
              <PrivateRoute>
                {' '}
                <PostItem />{' '}
              </PrivateRoute>
            }
          />

          {/* --- 2. ADD THE SEARCH ROUTE --- */}
          <Route path="/search" element={<Search />} />

          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
