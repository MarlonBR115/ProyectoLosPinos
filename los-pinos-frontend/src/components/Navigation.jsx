import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar, Divider
} from '@mui/material';
import Person from '@mui/icons-material/Person';
// ---- NUEVO: Importamos el ícono del menú de hamburguesa ----
import MenuIcon from '@mui/icons-material/Menu';

function Navigation() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // --- NUEVO: Estado para el menú de administrador (sin cambios) ---
  const [anchorElUser, setAnchorElUser] = useState(null);
  // --- NUEVO: Estado para el menú de navegación móvil ---
  const [anchorElNav, setAnchorElNav] = useState(null);

  // --- NUEVO: Manejadores para el menú de navegación móvil ---
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  
  // --- NUEVO: Manejadores para el menú de usuario (admin) ---
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleCloseNavMenu();
    handleCloseUserMenu();
  };

  const handleLogout = async () => {
    handleCloseUserMenu();
    await logout();
    navigate('/login');
  };

  const publicLinks = [
    { label: 'Inicio', path: '/' },
    { label: 'Menú', path: '/menu' },
    { label: 'Galería', path: '/galeria' },
    { label: 'Contacto', path: '/contact' },
  ];

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        {/* ---- NUEVO: Contenedor para el menú móvil ---- */}
        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="menu de navegación"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            {publicLinks.map((link) => (
              <MenuItem key={link.path} onClick={() => handleNavigate(link.path)}>
                <Typography textAlign="center">{link.label}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* --- Logo/Título del sitio --- */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: { xs: 1, md: 0 }, // El logo toma menos espacio en desktop
            mr: { md: 2 }, // Margen en desktop
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          Los Pinos
        </Typography>

        {/* ---- Links para la vista de escritorio (sin cambios de lógica) ---- */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {publicLinks.map((link) => (
            <Button
              key={link.path}
              onClick={() => handleNavigate(link.path)}
              sx={{ my: 2, color: 'inherit', display: 'block',
                fontWeight: location.pathname === link.path ? 'bold' : 'normal',
                textDecoration: location.pathname === link.path ? 'underline' : 'none',
                textUnderlineOffset: '4px',
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>

        {/* --- Botones de la derecha (Reservar y Login/Admin) --- */}
        <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
          <Button
              component={RouterLink}
              to="/reservations"
              variant="contained"
              color="secondary"
              sx={{ ml: { xs: 1, md: 2 } }}
          >
              Reservar
          </Button>

          {token ? (
            <Box sx={{ ml: 2 }}>
              <IconButton onClick={handleOpenUserMenu} size="small" title="Panel de Administrador">
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  {user ? user.name.charAt(0).toUpperCase() : <Person />}
                </Avatar>
              </IconButton>
              
              <Menu
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={() => handleNavigate('/admin/reservations')}>Admin: Reservas</MenuItem>
                <MenuItem onClick={() => handleNavigate('/admin/menu')}>Admin: Menú</MenuItem>
                <MenuItem onClick={() => handleNavigate('/admin/suggestions')}>Admin: Sugerencias</MenuItem>

                {user && user.role === 'admin' && (
                    <div role="none">
                        <Divider />
                        <MenuItem onClick={() => handleNavigate('/admin/testimonials')}>Admin: Testimonios</MenuItem>
                        <MenuItem onClick={() => handleNavigate('/admin/users')}>Admin: Usuarios</MenuItem>
                    </div>
                )}
                
                <Divider />
                <MenuItem component="a" href="https://webmail.lospinoshvca.com" target="_blank" onClick={handleCloseUserMenu}>Webmail</MenuItem>
                <MenuItem onClick={handleLogout} sx={{color: 'error.main'}}>Cerrar Sesión</MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login" sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
              Admin Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;