import { createTheme } from '@mui/material/styles';

// Creamos nuestro tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#6B4F4F', // Tono de acento de madera
    },
    secondary: {
      main: '#D84315', // Naranja quemado
    },
    background: {
      default: '#F7F5F2', // Fondo principal blanco hueso
      paper: '#FFFFFF',
    },
    text: {
      primary: '#363636', // Texto principal gris oscuro
      secondary: '#6B4F4F',
    },
  },
  typography: {
    fontFamily: '"Lato", "Roboto", "Helvetica", "Arial", sans-serif', // Fuente para párrafos
    h1: {
      fontFamily: '"Playfair Display", "Lora", "Georgia", serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Playfair Display", "Lora", "Georgia", serif',
      fontWeight: 700,
    },
    h3: {
        fontFamily: '"Playfair Display", "Lora", "Georgia", serif',
        fontWeight: 700,
    },
    h4: {
        fontFamily: '"Playfair Display", "Lora", "Georgia", serif',
        fontWeight: 700,
    },
    h5: {
        fontFamily: '"Playfair Display", "Lora", "Georgia", serif',
        fontWeight: 700,
    },
    h6: {
      fontFamily: '"Playfair Display", "Lora", "Georgia", serif',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;