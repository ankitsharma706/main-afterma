import { createContext, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const login = async () => {
    throw new Error('Mock authentication is disabled. Configure and use the backend auth service.');
  };
  const logout = () => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem('afterma_auth_token');
    window.localStorage.removeItem('afterma_user');
  };

  return (
    <AuthContext.Provider value={{ user: null, loading: false, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
