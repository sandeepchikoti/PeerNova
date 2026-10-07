import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('peernova_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('peernova_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await api.getCurrentUser();
          setUser(userData);
          localStorage.setItem('peernova_user', JSON.stringify(userData));
        } catch (err) {
          console.error('Session expired or invalid token:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    const userObj = {
      id: data.id,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      verificationStatus: data.verificationStatus,
    };
    setToken(data.token);
    setUser(userObj);
    localStorage.setItem('peernova_token', data.token);
    localStorage.setItem('peernova_user', JSON.stringify(userObj));
    return userObj;
  };

  const register = async (formData) => {
    const data = await api.register(formData);
    const userObj = {
      id: data.id,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      verificationStatus: data.verificationStatus,
    };
    setToken(data.token);
    setUser(userObj);
    localStorage.setItem('peernova_token', data.token);
    localStorage.setItem('peernova_user', JSON.stringify(userObj));
    return userObj;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('peernova_token');
    localStorage.removeItem('peernova_user');
  };

  const refreshUser = async () => {
    if (token) {
      try {
        const userData = await api.getCurrentUser();
        setUser(userData);
        localStorage.setItem('peernova_user', JSON.stringify(userData));
      } catch (err) {
        console.error('Failed to refresh user:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated: !!user && !!token,
        isStudent: user?.role === 'ROLE_STUDENT',
        isAdmin: user?.role === 'ROLE_ADMIN',
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
