import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const authLinks = (
    <div className="flex items-center space-x-4">
      <span className="text-gray-800">Hello, {user && user.name}</span>
      <button
        onClick={logout}
        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
      >
        Logout
      </button>
    </div>
  );

  const guestLinks = (
    <div className="flex items-center space-x-4">
      <Link
        to="/register"
        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        Register
      </Link>
      <Link
        to="/login"
        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        Login
      </Link>
    </div>
  );

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to={isAuthenticated ? '/dashboard' : '/login'} className="text-xl font-bold text-gray-900">
              MERN App
            </Link>
          </div>
          <div>
            {isAuthenticated ? authLinks : guestLinks}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;