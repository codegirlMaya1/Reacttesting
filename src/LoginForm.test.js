import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './LoginForm';

test('renders login form', () => {
  render(<LoginForm onLogin={() => {}} />);
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});

test('calls onLogin with username and password', () => {
  const handleLogin = jest.fn();
  render(<LoginForm onLogin={handleLogin} />);
  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
  fireEvent.click(screen.getByText(/login/i));
  expect(handleLogin).toHaveBeenCalledWith('testuser', 'password');
});