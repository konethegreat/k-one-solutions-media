// filepath: /c:/Users/Konet/OneDrive/Desktop/Social Media Platform/k-one-solutions-media/src/frontend/src/utils/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from './api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (token) => {
    localStorage.setItem('token', token);
    try {
      const response = await api.get('/profile'); // Fetch user profile
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/profile')
        .then(response => {
          setUser(response.data);
          setIsAuthenticated(true);
        })
        .catch(error => {
          console.error('Error fetching user profile:', error);
          logout();
        });
    }
  }, []);

  const contextValue = {
    user,
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useAuth = () => {
  return useContext(AuthContext);
};