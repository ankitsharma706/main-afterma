import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Incrementally load session from token
    const token = localStorage.getItem('afterma_auth_token');
    const storedUser = localStorage.getItem('afterma_user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
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
    localStorage.setItem('afterma_auth_token', token);
    localStorage.setItem('afterma_user', JSON.stringify(mockUser));
    
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('afterma_auth_token');
    localStorage.removeItem('afterma_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
