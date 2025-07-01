import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, CircularProgress, Alert, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import Add from '@mui/icons-material/Add';
import { getAllTables, createTable, updateTable, deleteTable } from '../api/services';

function AdminTablesPage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // --- Estado inicial cambiado para usar 'name' ---
  const [currentTable, setCurrentTable] = useState({ name: '', capacity: 4, location: 'salón' });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await getAllTables();
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
      // Sugerimos el siguiente número de mesa en el nombre
      const nextNumber = tables.length > 0 ? Math.max(...tables.map(t => t.id)) + 1 : 1;
      setCurrentTable({ name: `Mesa ${nextNumber}`, capacity: 4, location: 'salón' });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => setDialogOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTable(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Preparamos los datos para enviar. Excluimos el ID al crear.
      const { id, ...dataToSend } = currentTable;
      
      if (isEditing) {
        await updateTable(id, dataToSend);
      } else {
        await createTable(dataToSend);
      }
      fetchTables();
      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.message || `Error al ${isEditing ? 'actualizar' : 'crear'} la mesa.`);
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

      {/* --- Dialogo para Crear/Editar (modificado) --- */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? `Editar ${currentTable.name}` : 'Añadir Nueva Mesa'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
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
            margin="dense"
            name="capacity"
            label="Capacidad (personas)"
            type="number"
            fullWidth
            variant="standard"
            value={currentTable.capacity}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense" variant="standard">
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