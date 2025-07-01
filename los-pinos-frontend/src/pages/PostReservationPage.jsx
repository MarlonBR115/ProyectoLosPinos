import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Container, Paper, Typography, Box, Button, Grid } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

function PostReservationPage() {
  const location = useLocation();
  // Obtenemos los datos de la reserva que pasamos desde el formulario
  const reservation = location.state?.reservation;

  if (!reservation) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5">No se encontraron detalles de la reserva.</Typography>
        <Button component={RouterLink} to="/reservations" variant="contained" sx={{ mt: 2 }}>
          Volver al formulario
        </Button>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, textAlign: 'center' }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main' }} />
        <Typography component="h1" variant="h4" gutterBottom sx={{ mt: 2 }}>
          ¡Solicitud de Reserva Recibida!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Tu reserva con ID #{reservation.id} está ahora en estado <span style={{ fontWeight: 'bold' }}>pendiente</span>.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Nos comunicaremos contigo a la brevedad para confirmar tu mesa. Para agilizar el proceso, puedes contactarnos o realizar un pago a través de los siguientes medios:
        </Typography>

        <Grid container spacing={4} sx={{ mt: 3, justifyContent: 'center' }}>
          <Grid item xs={12} sm={5} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>QR para Yape/Plin</Typography>
            <img src="/images/qr-yape.png" alt="Código QR de Yape" style={{ maxWidth: '200px', width: '100%' }} />
          </Grid>
          <Grid item xs={12} sm={5} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>Contáctanos por WhatsApp</Typography>
            <img src="/images/qr-whatsapp.png" alt="Código QR de WhatsApp" style={{ maxWidth: '200px', width: '100%' }} />
          </Grid>
        </Grid>

        <Button component={RouterLink} to="/" variant="contained" sx={{ mt: 4 }}>
          Volver a la Página Principal
        </Button>
      </Paper>
    </Container>
  );
}

export default PostReservationPage;