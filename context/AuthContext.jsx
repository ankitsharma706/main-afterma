import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const readStoredSession = (key) => {
  if (typeof window === 'undefined') return null;

  try {
    const storedValue = window.localStorage.getItem(key);
    if (!storedValue) return null;
    return JSON.parse(storedValue);
  } catch (error) {
    return null;
  }
};

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Incrementally load session from token
    const token = typeof window !== 'undefined' ? window.localStorage.getItem('afterma_auth_token') : null;
    const storedUser = readStoredSession('afterma_user');

    if (token && storedUser && typeof storedUser === 'object') {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials, provider = 'email') => {
    // WARNING: Replace with actual backend API calls.
    // Example: const response = await axios.post('/auth/email', credentials);
    // const { token, user } = response.data;
    
    const token = 'mock_jwt_token_' + Date.now();
    const mockUser = {
      id: 'uid_' + Date.now(),
      name: credentials.name || 'Aditi Sharma',
      email: credentials.email || '',
      phone: credentials.phone || '',
      provider,
      avatar: ''
    };

    setUser(mockUser);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('afterma_auth_token', token);
      window.localStorage.setItem('afterma_user', JSON.stringify(mockUser));
    }

    return mockUser;
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('afterma_auth_token');
      window.localStorage.removeItem('afterma_user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
