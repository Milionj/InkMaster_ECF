import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/utilisateurs/me');
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = (userData) => {
    setUser(userData);
    setLoading(false);
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/utilisateurs/logout');
    } catch {
      // Ignore réseau pour l'UX
    } finally {
      setUser(null);
    }
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


