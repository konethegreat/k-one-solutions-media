/* eslint-env jest */
import jest, { describe, test, expect, beforeEach } from 'jest-mock';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import App from './App';
import '@testing-library/jest-dom/extend-expect';

// Mock API calls
jest.mock('./utils/api', () => ({
  get: jest.fn(),
  post: jest.fn()
}));

const renderApp = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  test('renders navigation elements', () => {
    renderApp();
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Messages/i)).toBeInTheDocument();
    expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
  });

  test('redirects to login for protected routes when not authenticated', () => {
    renderApp();
    const profileLink = screen.getByText(/Profile/i);
    fireEvent.click(profileLink);
    expect(window.location.pathname).toBe('/login');
  });
});