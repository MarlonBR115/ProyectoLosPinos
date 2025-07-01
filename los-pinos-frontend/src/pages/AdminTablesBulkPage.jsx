import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, Paper, TextField, Grid } from '@mui/material';
import { getAllTables, bulkUpdateTables } from '../api/services';
import Save from '@mui/icons-material/Save';

function AdminTablesBulkPage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleNameChange = (id, newName) => {
    setTables(prevTables =>
      prevTables.map(table =>
        table.id === id ? { ...table, name: newName } : table
      )
    );
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    
    // Validar nombres duplicados antes de enviar
    const names = tables.map(t => t.name);
    if (new Set(names).size !== names.length) {
      setError('Hay nombres de mesa duplicados. Por favor, corrígelos.');
      setIsSaving(false);
      return;
    }

    try {
      const dataToUpdate = {
        tables: tables.map(t => ({ id: t.id, name: t.name }))
      };
      await bulkUpdateTables(dataToUpdate);
      setSuccess('¡Todos los nombres de las mesas se han guardado correctamente!');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar los cambios.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>Edición Rápida de Nombres de Mesa</Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<Save />}
          onClick={handleSaveAll}
          disabled={isSaving}
        >
          {isSaving ? <CircularProgress size={24} /> : 'Guardar Todos los Cambios'}
        </Button>
      </Box>
      <Typography paragraph color="text.secondary">
        Modifica los nombres de las mesas aquí. Para "mover" una mesa, simplemente cambia los números en los nombres (ej. cambia "Mesa 9" por "Mesa 10"). Asegúrate de que no haya nombres repetidos antes de guardar.
      </Typography>

      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={2}>
        {['salón', 'patio', 'aire libre'].map(location => (
          <Grid item xs={12} md={4} key={location}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ textTransform: 'capitalize', mb: 2 }}>{location}</Typography>
              {tables.filter(t => t.location === location).map(table => (
                <TextField
                  key={table.id}
                  label={`ID Interno: ${table.id}`}
                  value={table.name}
                  onChange={(e) => handleNameChange(table.id, e.target.value)}
                  fullWidth
                  margin="dense"
                  variant="outlined"
                />
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default AdminTablesBulkPage;