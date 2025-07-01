import React, { useState } from 'react';
import { Container, Typography, Box, Chip, Paper } from '@mui/material';
import { Masonry } from '@mui/lab';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { motion } from 'framer-motion';

// Array con las 6 imágenes originales
const itemData = [
  { img: '/images/ambiente1.jpg', title: 'Ambiente Acogedor', category: 'Ambiente' },
  { img: '/images/plato1.jpg', title: 'Nuestra Sazón', category: 'Platos' },
  { img: '/images/local1.jpg', title: 'Vista del Local', category: 'Ambiente' },
  { img: '/images/plato2.jpg', title: 'Plato Tradicional', category: 'Platos' },
  { img: '/images/ambiente2.jpg', title: 'Espacio Familiar', category: 'Ambiente' },
  { img: '/images/plato3.jpg', title: 'Ingredientes Frescos', category: 'Platos' },
];

const categories = ['Todo', ...new Set(itemData.map(item => item.category))];

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

function GalleryPage() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [filter, setFilter] = useState('Todo');

  const filteredData = filter === 'Todo' ? itemData : itemData.filter(item => item.category === filter);
  const slides = filteredData.map(item => ({ src: item.img, title: item.title }));
  
  const openLightbox = (imageIndex) => {
      setIndex(imageIndex);
      setOpen(true);
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <Container sx={{ py: 4 }} maxWidth="lg" className="interactive-area">
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Nuestra Galería
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          Un vistazo a nuestro ambiente, nuestra gente y los sabores que nos hacen únicos.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 4, flexWrap: 'wrap' }}>
          {categories.map(category => (
            <Chip 
              key={category} 
              label={category} 
              onClick={() => setFilter(category)}
              variant={filter === category ? 'filled' : 'outlined'}
              color="primary"
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>

        {/* ---- MASONRY LAYOUT ESTILIZADO ---- */}
        <Masonry columns={{ xs: 2, sm: 3 }} spacing={2}>
          {filteredData.map((item, idx) => (
            <Paper 
              key={item.img}
              elevation={3}
              onClick={() => openLightbox(idx)} 
              sx={{ 
                position: 'relative', 
                cursor: 'pointer', 
                overflow: 'hidden',
                borderRadius: 2,
                '& .image-overlay': {
                  opacity: 0,
                  transition: 'opacity 0.3s ease-in-out',
                },
                '&:hover .image-overlay': {
                  opacity: 1,
                },
                  '& .gallery-image': {
                  transition: 'transform 0.3s ease-in-out',
                  display: 'block',
                  width: '100%',
                },
                '&:hover .gallery-image': {
                  transform: 'scale(1.05)',
                }
              }}
            >
              <img
                src={`${item.img}?w=248&fit=crop&auto=format`}
                srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                alt={item.title}
                loading="lazy"
                className="gallery-image"
              />
              <Box
                className="image-overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'flex-end',
                  p: 2,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">{item.title}</Typography>
              </Box>
            </Paper>
          ))}
        </Masonry>
      </Container>
      
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Zoom]}
      />
    </motion.div>
  );
}

export default GalleryPage;