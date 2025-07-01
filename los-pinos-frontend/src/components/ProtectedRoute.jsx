import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const { token } = useAuth(); // Usamos el token para verificar la autenticación

  if (!token) {
    // Si no hay token, redirige al usuario a la página de login
    return <Navigate to="/login" />;
  }

  // Si hay token, muestra el contenido de la ruta protegida
  return <Outlet />;
}

export default ProtectedRoute;