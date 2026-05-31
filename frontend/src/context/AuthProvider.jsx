import { useCallback, useEffect, useState } from 'react';
import { getSession, login as apiLogin, logout as apiLogout, register as apiRegister } from '../api/client';
import { AuthContext } from './AuthContext';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const data = await getSession();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = async (payload) => {
    const data = await apiLogin(payload);
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    return apiRegister(payload);
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
