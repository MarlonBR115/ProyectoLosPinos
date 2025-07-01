import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { getAdminReservations, deleteReservation, updateReservation, confirmReservation } from '../api/services';
import { useAuth } from '../context/AuthContext';
import EditReservationForm from '../components/EditReservationForm';

// Importaciones de Material-UI
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Chip, // Para mostrar el estado de forma visual
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Para la accesibilidad del modal
Modal.setAppElement('#root');

function AdminReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await getAdminReservations();
      setReservations(response.data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar las reservas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchReservations();
    }
  }, [token]);

  const handleDelete = async (reservationId) => {
    const isConfirmed = window.confirm('¿Estás seguro de que quieres cancelar esta reserva?');
    if (isConfirmed) {
      try {
        await deleteReservation(reservationId);
        setReservations(prevReservations => 
          prevReservations.filter(res => res.id !== reservationId)
        );
      } catch (err) {
        alert('Error al cancelar la reserva.');
        console.error(err);
      }
    }
  };
  
  const handleOpenModal = (reservation) => {
    setEditingReservation(reservation);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReservation(null);
  };

  const handleUpdateReservation = async (formData) => {
    const { id, ...data } = formData;
    const formattedData = {
      ...data,
      reservation_datetime: data.reservation_datetime.replace('T', ' ') + ':00',
      party_size: parseInt(data.party_size, 10),
    };
    try {
      const response = await updateReservation(id, formattedData);
      setReservations(prev => 
        prev.map(res => (res.id === id ? response.data : res))
      );
      handleCloseModal();
    } catch (err) {
      alert('Error al actualizar la reserva. Revise los datos.');
      console.error(err);
    }
  };

  const handleConfirm = async (reservationId) => {
    try {
      const response = await confirmReservation(reservationId);
      // Actualizamos la reserva en el estado local para que cambie visualmente
      setReservations(prev => 
        prev.map(res => (res.id === reservationId ? response.data : res))
      );
    } catch (err) {
      alert('Error al confirmar la reserva.');
      console.error(err);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center" sx={{ mt: 4 }}>{error}</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard de Reservas
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Fecha y Hora</TableCell>
              <TableCell>Personas</TableCell>
              <TableCell>Mesa</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.length > 0 ? (
              reservations.map((res) => (
                <TableRow key={res.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{res.id}</TableCell>
                  <TableCell>{res.customer_name}</TableCell>
                  <TableCell>{new Date(res.reservation_datetime).toLocaleString('es-PE')}</TableCell>
                  <TableCell>{res.party_size}</TableCell>
                  <TableCell>{res.table ? res.table.name : 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={res.status} 
                      color={res.status === 'confirmed' ? 'success' : (res.status === 'pending' ? 'warning' : 'default')}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {res.status === 'pending' && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleConfirm(res.id)}
                        sx={{ mr: 1 }}
                      >
                        Confirmar
                      </Button>
                    )}
                    <IconButton color="primary" onClick={() => handleOpenModal(res)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(res.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">No hay reservas para mostrar.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {editingReservation && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          contentLabel="Editar Reserva"
          style={{
            overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
            content: {
              top: '50%', left: '50%', right: 'auto', bottom: 'auto',
              marginRight: '-50%', transform: 'translate(-50%, -50%)',
              width: '90%', maxWidth: '500px'
            }
          }}
        >
          <EditReservationForm
            reservation={editingReservation}
            onUpdate={handleUpdateReservation}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </Container>
  );
}

export default AdminReservationsPage;