import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext'; // Importamos el hook

// Componentes
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import ForcePasswordChange from './components/ForcePasswordChange';

// Páginas
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import ReservationPage from './pages/ReservationPage';
import PostReservationPage from './pages/PostReservationPage';
import LoginPage from './pages/LoginPage';
import AdminReservationsPage from './pages/AdminReservationsPage';
import AdminMenuPage from './pages/AdminMenuPage';
import AdminSuggestionsPage from './pages/AdminSuggestionsPage';
import AdminTestimonialsPage from './pages/AdminTestimonialsPage';
import AdminUsersPage from './pages/AdminUsersPage';

// Componente Wrapper para las rutas (sin cambios)
const AppRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Rutas Públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/galeria" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/reservations" element={<ReservationPage />} />
        <Route path="/reserva-en-espera" element={<PostReservationPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/reservations" element={<AdminReservationsPage />} />
          <Route path="/admin/menu" element={<AdminMenuPage />} />
          <Route path="/admin/suggestions" element={<AdminSuggestionsPage />} />
          <Route path="/admin/testimonials" element={<AdminTestimonialsPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin" element={<Navigate to="/admin/reservations" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};


function App() {
  // ===== LÍNEA CLAVE QUE FALTABA O ESTABA INCORRECTA =====
  // Extraemos el token y la bandera del contexto de autenticación
  const { token, mustChangePassword } = useAuth(); 

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <Router>
      {/* Ahora 'token' está definido y se puede usar aquí */}
      {token && mustChangePassword && <ForcePasswordChange />}
      
      <Navigation />
      <AppRoutes />
    </Router>
  );
}

export default App;