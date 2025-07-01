import React, { useState, useEffect } from 'react';
// 1. AÑADIMOS LOS COMPONENTES NECESARIOS PARA EL SELECTOR
import {
  Box, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

function UserForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'editor', // 2. AÑADIMOS 'role' AL ESTADO INICIAL
  });

  useEffect(() => {
    if (initialData) {
      // Si estamos editando, llenamos el formulario con los datos existentes
      setFormData({
        name: initialData.name,
        email: initialData.email,
        password: '',
        role: initialData.role || 'editor', // Usamos el rol existente
      });
    } else {
      // Si estamos creando, el formulario empieza con valores por defecto
      setFormData({ name: '', email: '', password: '', role: 'editor' });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = { ...formData };
    // No enviamos la contraseña si está vacía (al editar)
    if (!dataToSubmit.password) {
      delete dataToSubmit.password;
    }
    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" component="h2" gutterBottom>
        {initialData ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        label="Nombre Completo"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      {/* 3. AÑADIMOS EL CAMPO DE SELECCIÓN DE ROL */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="role-select-label">Rol</InputLabel>
        <Select
          labelId="role-select-label"
          name="role"
          value={formData.role}
          label="Rol"
          onChange={handleChange}
        >
          <MenuItem value="admin">Administrador</MenuItem>
          <MenuItem value="editor">Editor</MenuItem>
        </Select>
      </FormControl>
      
      {/* El campo de contraseña solo aparece al crear un nuevo usuario */}
      {!initialData && (
        <TextField
          fullWidth
          margin="normal"
          label="Contraseña"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      )}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button type="button" onClick={onCancel} variant="outlined">Cancelar</Button>
        <Button type="submit" variant="contained">
          {initialData ? 'Guardar Cambios' : 'Crear Usuario'}
        </Button>
      </Box>
    </form>
  );
}

export default UserForm;