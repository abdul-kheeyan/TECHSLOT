import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser as loginAPI, getMe } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('techslot_token');
      if (token) {
        try {
          const { data } = await getMe();
          setUser(data.data);
        } catch {
          localStorage.removeItem('techslot_token');
          localStorage.removeItem('techslot_user');
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await loginAPI(credentials);
    const userData = data.data;
    localStorage.setItem('techslot_token', userData.token);
    localStorage.setItem('techslot_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('techslot_token');
    localStorage.removeItem('techslot_user');
    setUser(null);
  }, []);

  const value = { user, loading, login, logout, isAdmin: user?.role === 'admin' };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};