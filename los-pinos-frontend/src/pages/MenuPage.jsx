import React, { useState, useEffect, useRef } from 'react';
import { getMenuItems, getActiveSuggestions } from '../api/services';
import {
  Container, Typography, Box, CircularProgress, Grid, Card, CardMedia,
  CardContent, Modal, Button, Paper, List, ListItem, ListItemButton,
  ListItemText, Fab, Drawer // ----> 1. Importamos Fab y Drawer
} from '@mui/material';
// ----> 2. Importamos un nuevo ícono para el botón flotante
import { ForkKnife, ListDashes } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

// --- Estilos para el Modal y Animaciones de Página (sin cambios) ---
const modalStyle = {
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)', width: { xs: '90%', md: '60%' },
  bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2,
};
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};
const pageTransition = {
  type: "tween", ease: "anticipate", duration: 0.5
};

// --- Componente de Tarjeta de Recomendación (sin cambios) ---
const RecommendationCard = ({ title, item }) => (
  <Paper
    elevation={8}
    sx={{
      p: { xs: 2, md: 3 }, mb: 5, backgroundColor: 'primary.main', color: 'white',
      borderRadius: 2, border: '2px solid', borderColor: 'secondary.main'
    }}
    data-aos="fade-zoom-in" data-aos-easing="ease-in-back"
  >
    <Grid container spacing={{ xs: 2, md: 3 }} alignItems="center">
      <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
        <CardMedia component="img" sx={{
          width: '100%', maxWidth: '160px', aspectRatio: '1/1',
          borderRadius: '50%', border: '4px solid white', margin: 'auto', objectFit: 'cover'
        }} image={item.image_url || `https://via.placeholder.com/160.png?text=${item.name}`} alt={item.name} />
      </Grid>
      <Grid item xs={12} md={9}>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 'normal', opacity: 0.9 }}>{title}</Typography>
        <Typography variant="h4" component="p" sx={{ fontWeight: 'bold', my: 1, fontSize: { xs: '1.8rem', md: '2.125rem' } }}>{item.name}</Typography>
        <Typography variant="body1" sx={{ opacity: 0.95 }}>
          {item.description || item.menu_item?.description || "Una de nuestras especialidades más pedidas, ¡no te la puedes perder!"}
        </Typography>
      </Grid>
    </Grid>
  </Paper>
);

function MenuPage() {
  const [menuItems, setMenuItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const sectionRefs = useRef({});
  // ----> 3. Añadimos un estado para controlar el menú deslizable (Drawer)
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [menuResponse, suggestionsResponse] = await Promise.all([
          getMenuItems(),
          getActiveSuggestions()
        ]);
        
        const grouped = menuResponse.data.reduce((acc, item) => {
          if (item.is_available) { (acc[item.category] = acc[item.category] || []).push(item); }
          return acc;
        }, {});
        setMenuItems(grouped);
        setRecommendations(suggestionsResponse.data);

      } catch (err) {
        setError('No se pudo cargar la información del menú.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const handleOpenModal = (item) => { setSelectedItem(item); setModalOpen(true); };
  const handleCloseModal = () => setModalOpen(false);
  
  const scrollToCategory = (categoryId) => {
    sectionRefs.current[categoryId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // ----> Cerramos el menú deslizable al hacer clic
    setDrawerOpen(false);
  };

  const categories = Object.keys(menuItems).sort();

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center" sx={{ mt: 4 }}>{error}</Typography>;

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      <Container sx={{ py: 4 }} maxWidth="lg" className="interactive-area">
        <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
          Nuestra Carta
        </Typography>

        {recommendations.length > 0 && recommendations.map((rec) => (
          <RecommendationCard key={rec.id} title={rec.title} item={rec.menu_item} />
        ))}

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          
          {/* --- COLUMNA 1: BARRA LATERAL (OCULTA EN MÓVIL) --- */}
          {/* ----> 4. La barra lateral ahora se oculta en pantallas pequeñas (xs) */}
          <Box sx={{
            width: { xs: '100%', md: '250px' },
            position: { md: 'sticky' },
            top: '20px',
            alignSelf: 'flex-start',
            display: { xs: 'none', md: 'block' }
          }}>
            <Paper elevation={3} sx={{ p: 1 }}>
              <List>
                <ListItem><Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><ForkKnife /> Menú</Typography></ListItem>
                {categories.map((category) => (
                  <ListItem key={category} disablePadding><ListItemButton onClick={() => scrollToCategory(category)}><ListItemText primary={category} /></ListItemButton></ListItem>
                ))}
              </List>
            </Paper>
          </Box>

          {/* --- COLUMNA 2: CONTENIDO DEL MENÚ (SIN CAMBIOS GRANDES) --- */}
          <Box sx={{ flex: 1 }}>
            {categories.map((category) => (
              <Box key={category} id={category} ref={el => sectionRefs.current[category] = el} sx={{ mb: 6, scrollMarginTop: '80px' }}>
                <Typography variant="h4" sx={{ mb: 3, borderBottom: 2, borderColor: 'secondary.main', pb: 1, color: 'primary.main' }}>{category}</Typography>
                <Grid container spacing={3}>
                  {menuItems[category].map((item) => (
                    <Grid item xs={12} lg={6} key={item.id}>
                      <Card sx={{ display: 'flex', height: '100%', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 6 } }}>
                        <CardMedia component="img" sx={{ width: 140, objectFit: 'cover', flexShrink: 0 }} image={item.image_url || 'https://via.placeholder.com/140.png?text=Sin+Imagen'} alt={item.name} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{item.name}</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'secondary.main', ml: 1, whiteSpace: 'nowrap' }}>S/ {parseFloat(item.price).toFixed(2)}</Typography>
                          </Box>
                          {item.description && <Typography variant="body2" color="text.secondary" sx={{ mt: 1, flexGrow: 1 }}>{item.description}</Typography>}
                          <Button size="small" onClick={() => handleOpenModal(item)} sx={{ mt: 1, alignSelf: 'flex-end', fontWeight: 'bold' }}>Ver Detalles</Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Box>
        </Box>
        
        {/* --- MODAL (SIN CAMBIOS) --- */}
        <Modal open={modalOpen} onClose={handleCloseModal}>
          <Box sx={modalStyle}>
            {selectedItem && (<>
              <Typography variant="h4" component="h2">{selectedItem.name}</Typography>
              <CardMedia component="img" height="300" image={selectedItem.image_url || `https://via.placeholder.com/600x300.png?text=${selectedItem.name}`} alt={selectedItem.name} sx={{ my: 2, borderRadius: 2 }} />
              <Typography sx={{ mt: 2 }}>{selectedItem.description || "Una de nuestras especialidades más pedidas, preparada con los mejores ingredientes."}</Typography>
            </>)}
          </Box>
        </Modal>

        {/* ----> 5. BOTÓN FLOTANTE Y MENÚ DESLIZABLE (SÓLO PARA MÓVIL) <---- */}
        <Fab
            color="secondary"
            aria-label="ver categorías"
            onClick={() => setDrawerOpen(true)}
            sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                display: { xs: 'flex', md: 'none' } // <-- La magia está aquí
            }}
        >
            <ListDashes />
        </Fab>

        <Drawer
            anchor="bottom"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
        >
            <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>Categorías del Menú</Typography>
                <List>
                    {categories.map((category) => (
                        <ListItem key={category} disablePadding>
                            <ListItemButton onClick={() => scrollToCategory(category)}>
                                <ListItemText primary={category} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Drawer>
      </Container>
    </motion.div>
  );
}

export default MenuPage;