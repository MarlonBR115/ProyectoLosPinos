import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getMenuItems, getPublicTestimonials } from '../api/services';
import { Box, Button, Container, Typography, Grid, Card, CardContent, CardMedia, CircularProgress, Paper, CardActionArea } from '@mui/material';
import { Leaf, House, CookingPot, Star, TreeEvergreen, Mountains } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

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

// --- COMPONENTES DECORATIVOS ---
const MountainDecoration = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: { xs: 3, md: 2 }, userSelect: 'none' }}>
        <Mountains size={48} color="#A0522D" weight="fill" style={{ opacity: 0.6 }} />
        <Mountains size={64} color="#6B8E23" weight="fill" style={{ opacity: 0.8, margin: '0 1rem' }} />
        <Mountains size={48} color="#A0522D" weight="fill" style={{ opacity: 0.6 }} />
    </Box>
);

const PineCluster = ({ direction = 'left' }) => (
    <Box sx={{ display: {xs: 'none', md: 'flex'}, alignItems: 'flex-end', gap: 0.5, transform: direction === 'right' ? 'scaleX(-1)' : 'none' }}>
        <TreeEvergreen size={32} color="#2E7D32" weight="regular" style={{ opacity: 0.6 }} />
        <TreeEvergreen size={48} color="#1B5E20" weight="bold" style={{ opacity: 0.9 }} />
        <TreeEvergreen size={28} color="#388E3C" weight="light" style={{ opacity: 0.7 }} />
    </Box>
);

const EssenceItem = ({ icon, title, text, delay }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }} data-aos="fade-up" data-aos-delay={delay}>
        <PineCluster direction="left" />
        <Box sx={{ mx: {xs: 2, md: 4}, textAlign: 'center', minWidth: { xs: 'auto', md: '250px' } }}>
            {React.cloneElement(icon, { size: 48, color: '#A0522D' })}
            <Typography variant="h6" sx={{ mt: 1 }}>{title}</Typography>
            <Typography color="text.secondary">"{text}"</Typography>
        </Box>
        <PineCluster direction="right" />
    </Box>
);


function HomePage() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomePageData = async () => {
        try {
            const [menuResponse, testimonialsResponse] = await Promise.all([
                getMenuItems(),
                getPublicTestimonials()
            ]);

            const shuffled = [...menuResponse.data].sort(() => 0.5 - Math.random());
            setFeaturedItems(shuffled.slice(0, 3));
            setTestimonials(testimonialsResponse.data);

        } catch (error) {
            console.error("No se pudieron cargar los datos de la página de inicio:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchHomePageData();
  }, []);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <Box className="interactive-area">
        {/* === SECCIÓN HERO (RESPONSIVA) === */}
        <Box
          sx={{
            position: 'relative', color: 'white',
            height: { xs: '70vh', md: '60vh' },
            minHeight: '400px',
            textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
            '&::before': {
              content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1,
            },
            '& .hero-image': {
              position: 'absolute', top: 0, left: 0, width: '100%',
              height: '100%', objectFit: 'cover', zIndex: 0,
            }
          }}
        >
          <img src="/images/hero-background.jpg" alt="Paisaje del restaurante" className="hero-image" />
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, p: 2 }}>
            <Typography component="h1" variant="h2" gutterBottom sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' }
            }}>
              Recreo Campestre Los Pinos
            </Typography>
            <Typography variant="h5" paragraph sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' }
            }}>
              Una auténtica experiencia gastronómica que resalta los sabores de Huancavelica.
            </Typography>
            <Button
              variant="contained" color="secondary" size="large"
              component={RouterLink} to="/reservations"
            >
              Reservar una Mesa
            </Button>
          </Container>
        </Box>

        {/* === SECCIÓN PARALLAX "NUESTRA ESENCIA" (CORREGIDA) === */}
        <Box
          sx={{
            py: { xs: 6, md: 8 },
            backgroundImage: 'url(/images/paisaje-huancavelica.jpg)', // <-- IMAGEN RESTAURADA
            backgroundAttachment: 'fixed', // <-- EFECTO PARALLAX RESTAURADO
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }
          }}
        >
          <Container maxWidth="md" sx={{ position: 'relative' }}>
            <Paper
                elevation={8}
                sx={{
                    p: {xs: 3, md: 5},
                    backgroundColor: 'rgba(247, 245, 242, 0.92)',
                    backdropFilter: 'blur(5px)',
                    borderRadius: 2,
                    textAlign: 'center'
                }}
            >
                <Typography variant="h4" gutterBottom data-aos="fade-up">Nuestra Esencia</Typography>
                <Box sx={{mt: 2}}>
                    <EssenceItem icon={<Leaf />} title="Ingredientes de la Tierra" text="Sabor auténtico que nace en los campos de Huancavelica." delay="100" />
                    <EssenceItem icon={<House />} title="Ambiente Acogedor" text="El calor de un hogar campestre para ti y los tuyos." delay="200" />
                    <EssenceItem icon={<CookingPot />} title="Sazón Tradicional" text="Recetas de familia que han pasado de generación en generación." delay="300" />
                </Box>
            </Paper>
          </Container>
        </Box>

        {/* === SECCIÓN PLATOS DESTACADOS (SIN CAMBIOS) === */}
        <Box sx={{ bgcolor: 'background.paper', py: { xs: 6, md: 8 } }}>
          <Container maxWidth="lg">
            <Typography variant="h4" align="center" gutterBottom data-aos="fade-in">Platillos que Debes Probar</Typography>
            {loading ? <Box sx={{display: 'flex', justifyContent: 'center'}}><CircularProgress /></Box> : (
              <Grid container spacing={3} sx={{ mt: 2 }} data-aos="fade-up">
                {featuredItems.map((item) => (
                  <Grid item key={item.id} xs={12} sm={6} md={4}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardActionArea component={RouterLink} to="/menu">
                        <CardMedia
                          component="img"
                          height="220"
                          image={item.image_url || 'https://via.placeholder.com/300x220.png?text=Plato'}
                          alt={item.name}
                        />
                      </CardActionArea>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Container>
        </Box>
        
        {/* === SECCIÓN DE TESTIMONIOS (SIN CAMBIOS) === */}
        {testimonials.length > 0 && (
          <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'background.default' }}>
            <Container maxWidth="md">
              <Typography variant="h4" align="center" gutterBottom data-aos="fade-in">
                Lo que dicen nuestros clientes
              </Typography>
              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation={true}
                loop={true}
                style={{'--swiper-navigation-color': '#6B4F4F','--swiper-pagination-color': '#6B4F4F'}}
              >
                {testimonials.map((t) => (
                  <SwiperSlide key={t.id}>
                    <Paper elevation={0} sx={{ p: 4, my: 4, bgcolor: 'transparent' }}>
                      <Box sx={{display: 'flex', justifyContent: 'center', mb: 2}}>
                          {[...Array(t.rating)].map((_, i) => <Star key={i} size={24} weight="fill" style={{color: '#FFB400'}}/>)}
                      </Box>
                      <Typography variant="h6" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
                        "{t.quote}"
                      </Typography>
                      <Typography variant="subtitle1" align="center" sx={{ mt: 2, fontWeight: 'bold' }}>
                        - {t.author}
                      </Typography>
                    </Paper>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Container>
          </Box>
        )}

        {/* === SECCIÓN CTA (SIN CAMBIOS) === */}
        <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'primary.main', color: 'white' }}>
            <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                <Typography variant="h3" component="h2" gutterBottom data-aos="fade-up" sx={{ fontSize: { xs: '2.2rem', md: '3rem' } }}>
                    ¿Listo para vivir la experiencia?
                </Typography>
                <Typography variant="h6" color="rgba(255,255,255,0.8)" paragraph data-aos="fade-up" data-aos-delay="200">
                    Tu mesa en nuestro rincón campestre te está esperando.
                </Typography>
                <Button
                    component={RouterLink}
                    to="/reservations"
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{ mt: 2 }}
                    data-aos="fade-up" data-aos-delay="400"
                >
                    Reservar Ahora
                </Button>
            </Container>
        </Box>

      </Box>
    </motion.div>
  );
}

export default HomePage;