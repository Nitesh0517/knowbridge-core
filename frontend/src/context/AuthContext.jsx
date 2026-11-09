import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/firebase';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial user from localStorage
    const savedUser = authService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = await authService.login(email, password);
      setUser(loggedUser);
      // Sync with backend database
      try {
        await authApi.syncUser(loggedUser);
      } catch (err) {
        console.warn('Backend user sync failed, continuing locally:', err.message);
      }
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async () => {
    setLoading(true);
    try {
      const demoUser = await authService.login('architect@knowbridge.ai', 'demo12345');
      setUser(demoUser);
      return demoUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, displayName, organization) => {
    setLoading(true);
    try {
      const newUser = await authService.register(email, password, displayName, organization);
      setUser(newUser);
      try {
        await authApi.syncUser(newUser);
      } catch (err) {
        console.warn('Backend user sync failed:', err.message);
      }
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const resetPassword = async (email) => {
    return authService.resetPassword(email);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, demoLogin, register, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
