import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const saveAuth = useCallback((userData, tokenStr) => {
    setUser(userData);
    setToken(tokenStr);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tokenStr);
  }, []);

  const login = useCallback(async (phone, password) => {
    setLoading(true);
    try {
      const { data } = await authAPI.login({ phone, password });
      saveAuth(data.user, data.token);
      return data;
    } finally {
      setLoading(false);
    }
  }, [saveAuth]);

  const register = useCallback(async (formData) => {
    setLoading(true);
    try {
      const { data } = await authAPI.register(formData);
      saveAuth(data.user, data.token);
      return data;
    } finally {
      setLoading(false);
    }
  }, [saveAuth]);

  const registerLegacy = useCallback(async (formData) => {
    setLoading(true);
    try {
      const { data } = await authAPI.registerLegacy(formData);
      saveAuth(data.user, data.token);
      return data;
    } finally {
      setLoading(false);
    }
  }, [saveAuth]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const isAdmin = user?.role === 'admin';
  const isClient = user?.role === 'client';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{
      user, token, loading, isAdmin, isClient, isAuthenticated,
      login, register, registerLegacy, logout, saveAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
