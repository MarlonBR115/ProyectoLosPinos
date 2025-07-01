import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Checkbox, FormControlLabel } from '@mui/material';

function MenuItemForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', is_available: true,
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (initialData) {
      // ↓↓↓ CORRECCIÓN PARA LA ADVERTENCIA DEL TEXTAREA ↓↓↓
      const dataWithSafeDescription = {
        ...initialData,
        description: initialData.description || '', // Si la descripción es null, la convierte en ''
      };
      setFormData(dataWithSafeDescription);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = new FormData();
    dataToSubmit.append('name', formData.name);
    dataToSubmit.append('description', formData.description);
    dataToSubmit.append('price', parseFloat(formData.price));
    dataToSubmit.append('category', formData.category);
    dataToSubmit.append('is_available', formData.is_available ? 1 : 0);
    if (imageFile) {
      dataToSubmit.append('image', imageFile);
    }
    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit}>
        <h2>{initialData ? `Editar Platillo #${initialData.id}` : 'Crear Nuevo Platillo'}</h2>
        <TextField fullWidth margin="normal" label="Nombre" name="name" value={formData.name} onChange={handleChange} required />
        <TextField fullWidth margin="normal" label="Descripción" name="description" value={formData.description} onChange={handleChange} multiline rows={3} />
        <TextField fullWidth margin="normal" label="Precio (S/)" name="price" type="number" value={formData.price} onChange={handleChange} required step="0.01" />
        <TextField fullWidth margin="normal" label="Categoría" name="category" value={formData.category} onChange={handleChange} required />
        
        <Typography variant="body2" sx={{ mt: 2 }}>Imagen del Platillo:</Typography>
        <input type="file" name="image" onChange={handleImageChange} accept="image/*" />
        {initialData && initialData.image_url && (
            <Box sx={{ mt: 1 }}>
            <Typography variant="caption">Imagen actual:</Typography>
            <img src={initialData.image_url} alt="Imagen actual" style={{ width: '100px', marginLeft: '10px', verticalAlign: 'middle' }} />
            </Box>
        )}

        <FormControlLabel
            control={<Checkbox name="is_available" checked={Boolean(formData.is_available)} onChange={handleChange} />}
            label="¿Está disponible?" sx={{ display: 'block', mt: 2 }}
        />
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button type="button" onClick={onCancel} variant="outlined">Cancelar</Button>
            <Button type="submit" variant="contained">Guardar Cambios</Button>
        </Box>
    </form>
  );
}

export default MenuItemForm;