import React, { createContext, useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await FileSystem.readAsStringAsync(
          `${FileSystem.documentDirectory}pharmacy_auth.txt`,
          { encoding: FileSystem.EncodingType.UTF8 }
        );
        if (auth === 'true') setIsAuthenticated(true);
      } catch (e) {
        console.log('No auth file found');
      }
    };
    checkAuth();
  }, []);

  const login = async () => {
    setIsAuthenticated(true);
    await FileSystem.writeAsStringAsync(
      `${FileSystem.documentDirectory}pharmacy_auth.txt`,
      'true',
      { encoding: FileSystem.EncodingType.UTF8 }
    );
  };

  const logout = async () => {
    setIsAuthenticated(false);
    await FileSystem.deleteAsync(`${FileSystem.documentDirectory}pharmacy_auth.txt`, { idempotent: true });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;