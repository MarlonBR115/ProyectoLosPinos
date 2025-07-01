// src/components/ReservationForm.jsx

import React, { useState, useEffect } from 'react';
import { createReservation, getAllTables } from '../api/services';
import { Box, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';
// ----> 1. Importa el nuevo componente de mapa
import InteractiveTableMap from './InteractiveTableMap';
import { useNavigate } from 'react-router-dom';

function ReservationForm() {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    reservation_datetime: '',
    party_size: 1,
  });

  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getAllTables()
      .then(response => {
        setTables(response.data);
      })
      .catch(err => {
        console.error("Error fetching tables:", err);
        setErrorMessage("No se pudieron cargar las mesas. Intente refrescar la página.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTableId) {
      setErrorMessage('Por favor, seleccione una mesa.');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage('');
    
    const formattedDateTime = formData.reservation_datetime.replace('T', ' ') + ':00';
    const dataToSend = {
      ...formData,
      reservation_datetime: formattedDateTime,
      party_size: parseInt(formData.party_size, 10),
      table_id: selectedTableId,
    };

    try {
      const response = await createReservation(dataToSend);
      navigate('/reserva-en-espera', { state: { reservation: response.data.reservation } });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Ocurrió un error al procesar la reserva.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      {/* ----> 2. Reemplaza TableSelector con InteractiveTableMap */}
      <InteractiveTableMap 
        tables={tables}
        selectedTableId={selectedTableId}
        onSelectTable={setSelectedTableId}
      />

      <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>2. Complete sus Datos y la Fecha</Typography>
      <TextField margin="normal" required fullWidth label="Nombre Completo" name="customer_name" value={formData.customer_name} onChange={handleChange} />
      <TextField margin="normal" required fullWidth label="Correo Electrónico" name="customer_email" value={formData.customer_email} onChange={handleChange} />
      <TextField margin="normal" required fullWidth label="Teléfono" name="customer_phone" value={formData.customer_phone} onChange={handleChange} />
      
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <TextField
          required fullWidth label="Fecha y Hora" name="reservation_datetime" type="datetime-local"
          value={formData.reservation_datetime} onChange={handleChange} InputLabelProps={{ shrink: true }}
        />
        <TextField
          required sx={{ width: '150px' }} label="Personas" name="party_size" type="number"
          value={formData.party_size} onChange={handleChange} InputProps={{ inputProps: { min: 1 } }}
        />
      </Box>

      <Button
        type="submit" fullWidth variant="contained"
        disabled={isSubmitting || !selectedTableId || !formData.reservation_datetime || !formData.customer_name}
        sx={{ mt: 3, mb: 2 }}
      >
        {isSubmitting ? <CircularProgress size={24} /> : 'Solicitar Reserva'}
      </Button>

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </Box>
  );
}

export default ReservationForm;