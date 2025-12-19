import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { fetchProfile as fetchProfileApi, login as loginApi, logout as logoutApi } from '../api/backend.js';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const profile = await fetchProfileApi();
      setUser(profile);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = async (email, password, captchaToken) => {
    const userData = await loginApi(email, password, captchaToken);
    setUser(userData);
    setLoading(false);
    return userData;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore réseau pour l'UX
    }
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        isAuthenticated: Boolean(user),
        login,
        logout,
        refresh: fetchProfile,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
