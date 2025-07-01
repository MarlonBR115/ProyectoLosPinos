import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { getAdminMenuItems, deleteMenuItem, createMenuItem, updateMenuItem } from '../api/services';
import { useAuth } from '../context/AuthContext';
import MenuItemForm from '../components/MenuItemForm';

// Importaciones de Material-UI
import {
  Box, Button, Container, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, IconButton, CircularProgress,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

Modal.setAppElement('#root');

function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState({}); // Cambiado a objeto para agrupar
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await getAdminMenuItems();
      // Agrupamos los platillos por categoría
      const grouped = response.data.reduce((acc, item) => {
        (acc[item.category] = acc[item.category] || []).push(item);
        return acc;
      }, {});
      setMenuItems(grouped);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setError('No se pudieron cargar los platillos del menú.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMenuItems();
    }
  }, [token]);

  const handleDelete = async (itemId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este platillo?')) {
      try {
        await deleteMenuItem(itemId);
        fetchMenuItems();
      } catch (err) {
        alert('Error al eliminar el platillo.');
      }
    }
  };

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingItem) {
        await updateMenuItem(editingItem.id, formData);
      } else {
        await createMenuItem(formData);
      }
      fetchMenuItems();
      handleCloseModal();
    } catch (err) {
      alert('Error al guardar el platillo. Revise los datos e intente de nuevo.');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center" sx={{ mt: 4 }}>{error}</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">Gestión de Menú</Typography>
        <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => handleOpenModal()}>
          Crear Nuevo Platillo
        </Button>
      </Box>
      
      {Object.keys(menuItems).sort().map((category) => (
        <Accordion key={category} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{category} ({menuItems[category].length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead><TableRow><TableCell>Imagen</TableCell><TableCell>Nombre</TableCell><TableCell>Precio</TableCell><TableCell>Disponible</TableCell><TableCell align="right">Acciones</TableCell></TableRow></TableHead>
                <TableBody>
                  {menuItems[category].map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell><img src={item.image_url ? item.image_url : 'https://via.placeholder.com/50'} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} /></TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>S/ {parseFloat(item.price).toFixed(2)}</TableCell>
                      <TableCell>{item.is_available ? 'Sí' : 'No'}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="primary" onClick={() => handleOpenModal(item)}><EditIcon /></IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(item.id)}><DeleteIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal} style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1000 }, content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '600px', padding: '2rem' }}}>
          <MenuItemForm initialData={editingItem} onSubmit={handleFormSubmit} onCancel={handleCloseModal} />
        </Modal>
      )}
    </Container>
  );
}

export default AdminMenuPage;