import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api';
import { changePassword as changePasswordService } from '../api/services';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(true);
  // Nuevo estado para controlar si se debe mostrar el modal de cambio de contraseña
  const [mustChangePassword, setMustChangePassword] = useState(false);

  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, [token]);

  const login = async (credentials) => {
    const response = await apiClient.post('/login', credentials);
    const { access_token, user: userData, must_change_password } = response.data;
    
    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    setToken(access_token);
    setUser(userData);
    setMustChangePassword(must_change_password); // Guardamos el estado
    
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
  };

  const logout = async () => {
    await apiClient.post('/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    apiClient.defaults.headers.common['Authorization'] = null;
  };
  
  // Nueva función para manejar el cambio de contraseña
  const handlePasswordChange = async (passwordData) => {
    await changePasswordService(passwordData);
    // Una vez cambiada, actualizamos el estado para ocultar el modal
    setMustChangePassword(false); 
  };

  const value = {
    token,
    user,
    loading,
    login,
    logout,
    mustChangePassword, // Exponemos el estado al resto de la app
    handlePasswordChange, // Exponemos la función
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};