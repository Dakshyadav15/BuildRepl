// frontend/src/components/auth/Login.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

import Login from './Login'; // Adjust path if needed
import AuthContext from '../../context/AuthContext'; // Adjust path

// Helper function to render the component with a mock context
const renderLoginWithContext = (mockLoginFunction) => {
  const contextValue = {
    login: mockLoginFunction,
    // Add other context properties your component might need
    isAuthenticated: false,
    user: null,
    error: null,
  };

  return render(
    <AuthContext.Provider value={contextValue}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('Login Component', () => {
  test('allows a user to type and submit the form', async () => {
    // 1. Create a "mock function" (a spy) that we can track
    const mockLogin = vi.fn();

    // 2. Setup the user-event instance
    const user = userEvent.setup();

    // 3. Render the component, passing in our mock function
    renderLoginWithContext(mockLogin);

    // 4. Find the form elements
    //    Using 'getByLabelText' is best practice.
    //    This requires you to have <label htmlFor="email">Email</label>
    //    If you don't, use getByPlaceholderText or getByRole.
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    // 5. Simulate user typing
    //    This is an async operation
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    // 6. Simulate user clicking the submit button
    await user.click(submitButton);
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
