import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser as loginAPI, getMe } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState('');

  const restoreSession = useCallback(async () => {
    setLoading(true);
    setSessionError('');
    const token = localStorage.getItem('techslot_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await getMe();
      setUser(data.data);
    } catch (error) {
      setUser(null);
      if (error.response?.status === 401) {
        localStorage.removeItem('techslot_token');
        localStorage.removeItem('techslot_user');
      } else {
        setSessionError('Unable to verify your session. Check your connection and retry.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) restoreSession();
    });
    return () => { active = false; };
  }, [restoreSession]);

  const login = useCallback(async (credentials) => {
    const { data } = await loginAPI(credentials);
    const userData = data.data;
    localStorage.setItem('techslot_token', userData.token);
    localStorage.setItem('techslot_user', JSON.stringify(userData));
    setSessionError('');
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('techslot_token');
    localStorage.removeItem('techslot_user');
    setSessionError('');
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    sessionError,
    restoreSession,
    login,
    logout,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};