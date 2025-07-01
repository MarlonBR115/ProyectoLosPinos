import React, { useState, useEffect } from 'react';
import {
  getAdminSuggestions, createSuggestion, updateSuggestion, deleteSuggestion
} from '../api/services';
import {
  Box, Button, Container, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, IconButton, Chip, CircularProgress, Modal
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SuggestionForm from '../components/SuggestionForm';

const modalStyle = {
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)', width: { xs: '90%', md: '500px' },
  bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2
};

const daysOfWeekMap = { 0: 'Domingo', 1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado' };

function AdminSuggestionsPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSuggestion, setEditingSuggestion] = useState(null);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const response = await getAdminSuggestions();
      setSuggestions(response.data);
    } catch (err) {
      setError('No se pudieron cargar las sugerencias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleOpenModal = (suggestion = null) => {
    setEditingSuggestion(suggestion);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingSuggestion(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta sugerencia?')) {
      await deleteSuggestion(id);
      fetchSuggestions();
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingSuggestion) {
        await updateSuggestion(editingSuggestion.id, formData);
      } else {
        await createSuggestion(formData);
      }
      fetchSuggestions();
      handleCloseModal();
    } catch (err) {
      alert('Error al guardar la sugerencia. Revisa los datos.');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center">{error}</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">Gestión de Sugerencias</Typography>
        <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => handleOpenModal()}>
          Crear Sugerencia
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead><TableRow>
            <TableCell>Título</TableCell>
            <TableCell>Platillo Sugerido</TableCell>
            <TableCell>Día</TableCell>
            <TableCell>Horario</TableCell>
            <TableCell>Activa</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow></TableHead>
          <TableBody>
            {suggestions.map((sug) => (
              <TableRow key={sug.id} hover>
                <TableCell>{sug.title}</TableCell>
                <TableCell>{sug.menu_item?.name || 'N/A'}</TableCell>
                <TableCell>{daysOfWeekMap[sug.day_of_week] ?? 'Cualquier día'}</TableCell>
                <TableCell>{sug.start_time.substring(0,5)} - {sug.end_time.substring(0,5)}</TableCell>
                <TableCell>
                  <Chip label={sug.is_active ? 'Sí' : 'No'} color={sug.is_active ? 'success' : 'default'} size="small" />
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpenModal(sug)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(sug.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <SuggestionForm initialData={editingSuggestion} onSubmit={handleFormSubmit} onCancel={handleCloseModal} />
        </Box>
      </Modal>
    </Container>
  );
}

export default AdminSuggestionsPage;