import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Modal, Paper, Typography, TextField, Button, Alert } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function ForcePasswordChange() {
  const { handlePasswordChange } = useAuth();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== passwordConfirmation) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    try {
      await handlePasswordChange({ password, password_confirmation: passwordConfirmation });
      // El modal se cerrará automáticamente porque el estado en AuthContext cambiará.
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Ocurrió un error.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={true} // Siempre está abierto cuando se renderiza
      aria-labelledby="force-password-change-title"
      // No se puede cerrar haciendo clic fuera
      BackdropProps={{
        style: {
          backdropFilter: 'blur(3px)',
        },
      }}
    >
      <Paper sx={style}>
        <Typography id="force-password-change-title" variant="h6" component="h2">
          Cambio de Contraseña Obligatorio
        </Typography>
        <Typography sx={{ mt: 1, mb: 2 }}>
          Por seguridad, debes cambiar tu contraseña inicial antes de continuar.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            type="password"
            label="Nueva Contraseña"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            type="password"
            label="Confirmar Nueva Contraseña"
            fullWidth
            margin="normal"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Cambiando...' : 'Guardar Nueva Contraseña'}
          </Button>
        </form>
      </Paper>
    </Modal>
  );
}

export default ForcePasswordChange;