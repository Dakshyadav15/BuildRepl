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
    try {
      const res = await api.get('/auth');
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      localStorage.removeItem('token');
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
      console.error('Registration failed', err.response.data.msg);
    }
  };

  const login = async (formData) => {
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      await loadUser();
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed', err.response.data.msg);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, register, login, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;