import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Checkbox, FormControlLabel,
  Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { getAdminMenuItems } from '../api/services';

const daysOfWeek = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
];

function SuggestionForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    menu_item_id: '',
    day_of_week: '', // Usamos string vacío para "Cualquier día"
    start_time: '12:00',
    end_time: '17:00',
    is_active: true,
  });
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    // Cargar todos los platillos para el selector
    getAdminMenuItems().then(response => {
      setMenuItems(response.data);
    });
    
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        menu_item_id: initialData.menu_item_id || '',
        day_of_week: initialData.day_of_week === null ? '' : initialData.day_of_week,
        start_time: initialData.start_time ? initialData.start_time.substring(0, 5) : '12:00',
        end_time: initialData.end_time ? initialData.end_time.substring(0, 5) : '17:00',
        is_active: initialData.is_active,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      day_of_week: formData.day_of_week === '' ? null : formData.day_of_week,
    };
    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" component="h2" gutterBottom>
        {initialData ? 'Editar Sugerencia' : 'Crear Nueva Sugerencia'}
      </Typography>
      <TextField fullWidth margin="normal" label="Título de la Sugerencia" name="title" value={formData.title} onChange={handleChange} required />
      
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Platillo a Sugerir</InputLabel>
        <Select name="menu_item_id" value={formData.menu_item_id} label="Platillo a Sugerir" onChange={handleChange}>
          {menuItems.map(item => (
            <MenuItem key={item.id} value={item.id}>{item.name} ({item.category})</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Día de la Semana</InputLabel>
        <Select name="day_of_week" value={formData.day_of_week} label="Día de la Semana" onChange={handleChange}>
          <MenuItem value=""><em>Cualquier día</em></MenuItem>
          {daysOfWeek.map(day => (
            <MenuItem key={day.value} value={day.value}>{day.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
        <TextField fullWidth type="time" label="Hora de Inicio" name="start_time" value={formData.start_time} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
        <TextField fullWidth type="time" label="Hora de Fin" name="end_time" value={formData.end_time} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
      </Box>

      <FormControlLabel
        control={<Checkbox name="is_active" checked={formData.is_active} onChange={handleChange} />}
        label="¿Sugerencia activa?"
        sx={{ display: 'block', mt: 2 }}
      />
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button type="button" onClick={onCancel} variant="outlined">Cancelar</Button>
        <Button type="submit" variant="contained">{initialData ? 'Guardar Cambios' : 'Crear Sugerencia'}</Button>
      </Box>
    </form>
  );
}

export default SuggestionForm;