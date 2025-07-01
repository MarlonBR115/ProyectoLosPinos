import React from 'react';
import ReservationForm from '../components/ReservationForm';
import { Container, Paper, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

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

function ReservationPage() {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <Container component="main" maxWidth="md" sx={{ my: 4 }} className="interactive-area">
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography component="h1" variant="h4" gutterBottom>
              Realizar una Reserva
            </Typography>
            <Typography variant="body1">
              Complete el siguiente formulario para asegurar su mesa en Recreo Campestre Los Pinos.
            </Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
            <ReservationForm />
          </Box>
        </Paper>
      </Container>
    </motion.div>
  );
}

export default ReservationPage;