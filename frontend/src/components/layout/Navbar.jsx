import React, { useState, useContext } from 'react';
// Import useNavigate to handle the redirect on search submit
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);

  // --- 1. ADD STATE FOR SEARCH ---
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // --- 2. ADD SUBMIT HANDLER ---
  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to the new search page with the query
      navigate(`/search?q=${searchQuery}`);
      setSearchQuery(''); // Clear the input after search
    }
  };

  const authLinks = (
    <>
      <Link
        to="/dashboard"
        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        Dashboard
      </Link>
      <a
        onClick={logout}
        href="#!"
        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        Logout
      </a>
    </>
  );

  const guestLinks = (
    <>
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
    </>
  );

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold text-blue-600">
              Blog
            </Link>
          </div>

          {/* --- 3. ADD SEARCH FORM --- */}
          <div className="flex items-center">
            <form onSubmit={onSearchSubmit}>
              <input
                type="search"
                name="search" // This matches your E2E test selector
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </form>
          </div>
          {/* --- END SEARCH FORM --- */}

          <div className="flex items-center space-x-1">
            {isAuthenticated ? authLinks : guestLinks}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
