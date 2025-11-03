import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    if (!localStorage.token) {
      setLoading(false);
      return;
    }
    // Set token on API header for authenticated requests
    api.defaults.headers.common['x-auth-token'] = localStorage.token;

    try {
      const res = await api.get('/auth');
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      // Token is invalid, remove it
      localStorage.removeItem('token');
      delete api.defaults.headers.common['x-auth-token'];
    }
    setLoading(false);
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      await loadUser();
      navigate('/dashboard');
    } catch (err) {
      // Ensure we log the actual error response message
      console.error(
        'Registration failed',
        err.response ? err.response.data.msg : err.message
      );
    }
  };

  const login = async (formData) => {
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      await loadUser();

      // ✅ YOUR NAVIGATION LOGIC IS CORRECT
      navigate('/dashboard');
    } catch (err) {
      // Ensure we log the actual error response message
      console.error(
        'Login failed',
        err.response ? err.response.data.msg : err.message
      );
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['x-auth-token'];
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, register, login, logout }}
    >
      {/* Renders children only after the initial loading check is complete */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
