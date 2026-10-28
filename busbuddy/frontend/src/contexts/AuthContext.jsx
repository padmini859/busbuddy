import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('busbuddy_token'));
  const [user, setUser] = useState(() => localStorage.getItem('busbuddy_user'));
  const [role, setRole] = useState(() => localStorage.getItem('busbuddy_role'));

  const login = (authToken, username, userRole) => {
    localStorage.setItem('busbuddy_token', authToken);
    localStorage.setItem('busbuddy_user', username);
    localStorage.setItem('busbuddy_role', userRole || 'ROLE_ADMIN');
    setToken(authToken);
    setUser(username);
    setRole(userRole || 'ROLE_ADMIN');
  };

  const logout = () => {
    localStorage.removeItem('busbuddy_token');
    localStorage.removeItem('busbuddy_user');
    localStorage.removeItem('busbuddy_role');
    setToken(null);
    setUser(null);
    setRole(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, role, isAuthenticated, login, logout }}>
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
