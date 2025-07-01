import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Paper, TextField, Button, CircularProgress, Alert, Rating } from '@mui/material';
import { motion } from 'framer-motion';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Phone, MapPin, Star } from '@phosphor-icons/react';
// ----> 1. Importamos los servicios para obtener los platos del menú
import { createTestimonial, getMenuItems } from '../api/services';

// ----> 2. Importamos los componentes y estilos de Swiper (el carrusel)
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';


const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px'
};

const center = {
  lat: -12.783237136818984,
  lng: -74.9591083034244,
};

const API_KEY = ""; // Tu clave de API

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

function ContactPage() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY
  });

  const [testimonial, setTestimonial] = useState({ author: '', quote: '', rating: 5 });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  // ----> 3. Añadimos un estado para guardar las imágenes del menú
  const [menuImages, setMenuImages] = useState([]);

  // ----> 4. Usamos useEffect para cargar las imágenes al iniciar la página
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await getMenuItems();
        const images = response.data
          .filter(item => item.image_url) // Filtramos solo los que tienen imagen
          .map(item => item.image_url); // Extraemos solo las URLs
        setMenuImages(images);
      } catch (error) {
        console.error("No se pudieron cargar las imágenes del menú:", error);
      }
    };
    fetchImages();
  }, []);

  const handleTestimonialChange = (e) => {
    setTestimonial(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRatingChange = (event, newValue) => {
    setTestimonial(prev => ({ ...prev, rating: newValue }));
  };

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', message: '' });
    try {
      await createTestimonial(testimonial);
      setFeedback({ type: 'success', message: '¡Gracias por tu opinión! La revisaremos para publicarla.' });
      setTestimonial({ author: '', quote: '', rating: 5 });
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Hubo un error al enviar tu opinión.';
      setFeedback({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component={motion.div}
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={pageTransition}
      sx={{
        position: 'relative',
        py: 4,
        overflow: 'hidden', // Evita que cualquier cosa se desborde
      }}
    >
      {/* ----> 5. El carrusel se coloca aquí, como fondo de toda la página <---- */}
      {menuImages.length > 0 && (
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          allowTouchMove={false} // Deshabilitamos la interacción del usuario
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -2, // Lo ponemos muy al fondo
          }}
        >
          {menuImages.map((img, index) => (
            <SwiperSlide key={index}>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Capa semitransparente y borrosa */}
      <Box sx={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(5px)',
        zIndex: -1,
      }} />

      <Container sx={{ position: 'relative' }} maxWidth="lg" className="interactive-area">
        <Typography variant="h2" align="center" gutterBottom color="white" sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
            Contáctanos
        </Typography>
        <Typography variant="h6" align="center" color="rgba(255,255,255,0.9)" paragraph>
          Estamos aquí para servirte. Encuéntranos, llámanos o déjanos tu opinión.
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {/* El resto del código de las columnas no necesita cambios */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
              <Typography variant="h5" gutterBottom>Nuestra Ubicación</Typography>
              {isLoaded ? (
                <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={16}>
                  <Marker position={center} title="Recreo Campestre Los Pinos" />
                </GoogleMap>
              ) : <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px'}}><CircularProgress /></Box>}
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, gap: 2 }}>
                <MapPin size={28} color="#D84315" /> 
                <Typography>Los Incas s/n, Huancavelica 09001, Perú</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 2 }}>
                <Phone size={28} color="#D84315"/> 
                <Typography>+51 921 687 168</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: { xs: 2, sm: 4 }, height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
              <Typography variant="h5" gutterBottom>Déjanos tu Opinión</Typography>
              <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                Tu feedback es muy importante para nosotros. Comparte tu experiencia para ayudarnos a mejorar.
              </Typography>
              <form onSubmit={handleTestimonialSubmit}>
                <TextField name="author" label="Tu Nombre" value={testimonial.author} onChange={handleTestimonialChange} fullWidth required margin="normal" />
                <TextField name="quote" label="Tu Opinión" value={testimonial.quote} onChange={handleTestimonialChange} fullWidth required multiline rows={4} margin="normal" />
                <Box sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography component="legend">Tu Calificación:</Typography>
                  <Rating
                    name="rating"
                    value={testimonial.rating}
                    onChange={handleRatingChange}
                    size="large"
                    emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
                  />
                </Box>
                <Button type="submit" variant="contained" size="large" disabled={loading} sx={{mt: 1}}>
                  {loading ? <CircularProgress size={24} /> : 'Enviar Opinión'}
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>

        {feedback.message && 
            <Alert severity={feedback.type} sx={{ mt: 4, width: '100%' }} onClose={() => setFeedback({type: '', message: ''})}>
                {feedback.message}
            </Alert>
        }
      </Container>
    </Box>
  );
}

export default ContactPage;
