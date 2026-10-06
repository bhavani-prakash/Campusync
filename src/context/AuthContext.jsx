import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.success) {
            setUser(res.data.user);
            setProfile(res.data.profile);
            setToken(storedToken);
          }
        } catch (err) {
          console.error('Session restoration failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success) {
        const { token: authToken, user: userData, profile: profileData } = res.data;
        localStorage.setItem('token', authToken);
        setToken(authToken);
        setUser(userData);
        setProfile(profileData);
        return res.data;
      }
    } catch (err) {
      const errMsg = err.message || 'Login failed. Please check your credentials.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  // Register handler
  const register = async (registerData) => {
    setError(null);
    try {
      const res = await api.post('/auth/register', registerData);
      if (res.success) {
        const { token: authToken, user: userData, profile: profileData } = res.data;
        localStorage.setItem('token', authToken);
        setToken(authToken);
        setUser(userData);
        setProfile(profileData);
        return res.data;
      }
    } catch (err) {
      const errMsg = err.message || 'Registration failed. Please try again.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout endpoint error ignored');
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setProfile(null);
      setToken(null);
      setError(null);
    }
  };

  // Profile state updater
  const updateLocalProfile = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        error,
        login,
        register,
        logout,
        updateLocalProfile,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
