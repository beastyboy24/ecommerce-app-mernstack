import { createContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? jwtDecode(token) : null;
  });

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};