import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, CircularProgress, Alert, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { getAllTables, createTable, updateTable, deleteTable } from '../api/services';

// Estado inicial para una mesa nueva, fuera del componente para evitar re-creaciones
const initialTableState = { name: '', capacity: 4, location: 'salón' };

function AdminTablesPage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTable, setCurrentTable] = useState(initialTableState);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await getAllTables();
      const sortedTables = response.data.sort((a, b) => {
        const numA = parseInt(a.name.split(' ')[1] || '0', 10);
        const numB = parseInt(b.name.split(' ')[1] || '0', 10);
        return numA - numB;
      });
      setTables(response.data);
    } catch (err) {
      setError('No se pudieron cargar las mesas.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (table = null) => {
    setError('');
    if (table) {
      setIsEditing(true);
      setCurrentTable({ ...table });
    } else {
      setIsEditing(false);
      const nextNumber = tables.length > 0 ? Math.max(...tables.map(t => parseInt(t.name.split(' ')[1]) || 0)) + 1 : 1;
      setCurrentTable({ ...initialTableState, name: `Mesa ${nextNumber}` });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => setDialogOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTable(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // --- PRUEBA CLAVE: Para ver si la función se está ejecutando ---
    console.log("Se hizo clic en el botón de Guardar/Crear. Datos actuales:", currentTable);
    
    setError('');

    try {
      const dataToSend = {
        name: currentTable.name,
        capacity: parseInt(currentTable.capacity, 10), // Aseguramos que sea un número
        location: currentTable.location,
      };

      if (isEditing) {
        await updateTable(currentTable.id, dataToSend);
      } else {
        await createTable(dataToSend);
      }

      await fetchTables(); // Esperamos a que se actualicen las mesas
      handleCloseDialog();

    } catch (err) {
      console.error("Error al enviar el formulario:", err);
      const message = err.response?.data?.message || err.message || `Error al ${isEditing ? 'actualizar' : 'crear'} la mesa.`;
      setError(message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta mesa?')) {
      try {
        await deleteTable(id);
        fetchTables();
      } catch (err) {
        setError(err.response?.data?.message || 'Error al eliminar la mesa.');
      }
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Gestión de Mesas</Typography>
      <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>
        Añadir Mesa
      </Button>

      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre de Mesa</TableCell>
              <TableCell>Capacidad</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tables.map((table) => (
              <TableRow key={table.id}>
                <TableCell>{table.name}</TableCell>
                <TableCell>{table.capacity} personas</TableCell>
                <TableCell>{table.location}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenDialog(table)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(table.id)}><Delete color="error" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialogo para Crear/Editar */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} >
        <DialogTitle>{isEditing ? `Editar ${currentTable.name}` : 'Añadir Nueva Mesa'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            name="name"
            label="Nombre / Número de Mesa"
            type="text"
            fullWidth
            variant="standard"
            value={currentTable.name}
            onChange={handleInputChange}
          />
          <TextField
            required
            margin="dense"
            name="capacity"
            label="Capacidad (personas)"
            type="number"
            fullWidth
            variant="standard"
            value={currentTable.capacity}
            onChange={handleInputChange}
          />
          <FormControl fullWidth required margin="dense" variant="standard">
            <InputLabel>Ubicación</InputLabel>
            <Select
              name="location"
              value={currentTable.location}
              onChange={handleInputChange}
            >
              <MenuItem value="salón">Salón</MenuItem>
              <MenuItem value="patio">Patio Principal</MenuItem>
              <MenuItem value="aire libre">Aire Libre</MenuItem>
            </Select>
          </FormControl>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit}>{isEditing ? 'Guardar Cambios' : 'Crear'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminTablesPage;