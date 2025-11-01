import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const authLinks = (
    <ul style={{ display: 'flex', listStyle: 'none', gap: '1rem', margin: 0 }}>
      <li>Hello, {user && user.name}</li>
      <li><a onClick={logout} href="#!" style={{cursor: 'pointer'}}>Logout</a></li>
    </ul>
  );

  const guestLinks = (
    <ul style={{ display: 'flex', listStyle: 'none', gap: '1rem', margin: 0 }}>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
    </ul>
  );

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eee', padding: '1rem' }}>
      <h1 style={{fontSize: '1.5rem', margin: 0}}>
        <Link to={isAuthenticated ? '/dashboard' : '/login'}>MERN App</Link>
      </h1>
      {isAuthenticated ? authLinks : guestLinks}
    </nav>
  );
};

export default Navbar;