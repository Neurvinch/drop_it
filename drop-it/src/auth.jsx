// src/auth.js
import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const login = async (email, password) => {
    const res = await axios.post(`${import.meta.env.REACT_APP_API_URL}/login`, { email, password });
    setUser(res.data.user);
    setToken(res.data.token);
    localStorage.setItem('token', res.data.token);
  };

  const register = async (username, email, password, roles) => {
    const res = await axios.post(`${import.meta.env.REACT_APP_API_URL}/register`, { username, email, password, roles });
    setUser(res.data.user);
    setToken(res.data.token);
    localStorage.setItem('token', res.data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);