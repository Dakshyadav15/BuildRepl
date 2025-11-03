// frontend/src/components/layout/Navbar.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

import Navbar from './Navbar'; // Adjust this path if needed
import AuthContext from '../../context/AuthContext'; // Adjust this path

// We create a helper function to avoid repeating this setup.
// It renders the Navbar wrapped in the necessary providers.
const renderNavbarWithContext = (contextValue) => {
  return render(
    <AuthContext.Provider value={contextValue}>
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('Navbar Component', () => {
  test('renders "Login" and "Register" links when logged out', () => {
    // 1. Define the mock context state for a logged-out user
    const loggedOutState = {
      isAuthenticated: false,
      user: null,
      logout: vi.fn(), // Use vi.fn() for any functions in the context
    };

    // 2. Render the component with this mock state
    renderNavbarWithContext(loggedOutState);

    // 3. Assert: Check that the correct links are on the screen
    //    'getByText' will find the element or throw an error if it can't
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();

    // 4. Assert: Check that "Logout" is NOT on the screen
    //    'queryByText' will return 'null' if it can't find the element
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  test('renders "Logout" button when logged in', () => {
    // 1. Define the mock context state for a logged-in user
    const loggedInState = {
      isAuthenticated: true,
      user: { name: 'Test User' },
      logout: vi.fn(),
    };

    // 2. Render the component with this mock state
    renderNavbarWithContext(loggedInState);

    // 3. Assert: Check that the "Logout" button is present
    expect(screen.getByText('Logout')).toBeInTheDocument();

    // 4. Assert: Check that "Login" and "Register" are NOT present
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
  });
});
