import React, { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="flex justify-center mt-16">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <form onSubmit={onSubmit} className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Login
          </h2>

          <div>
            <label
              htmlFor="email" // <-- ADD THIS
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email" // <-- ADD THIS
              type="email"
              name="email"
              placeholder="Email"
              onChange={onChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password" // <-- ADD THIS
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password" // <-- ADD THIS
              type="password"
              name="password"
              placeholder="Password"
              onChange={onChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
