import React, { useState, useEffect } from 'react';
import { getAdminTestimonials, updateTestimonial, deleteTestimonial } from '../api/services';
import { Box, Button, Container, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, Chip, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';

function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      const { data } = await getAdminTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error("Error al cargar testimonios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleVisibilityChange = async (testimonial) => {
    const updatedTestimonial = { ...testimonial, is_visible: !testimonial.is_visible };
    await updateTestimonial(testimonial.id, updatedTestimonial);
    fetchTestimonials();
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres borrar este testimonio?")) {
      await deleteTestimonial(id);
      fetchTestimonials();
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>Gestión de Testimonios</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead><TableRow>
            <TableCell>Autor</TableCell>
            <TableCell>Opinión</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Visible</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow></TableHead>
          <TableBody>
            {testimonials.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.author}</TableCell>
                <TableCell>{t.quote}</TableCell>
                <TableCell><Box sx={{display: 'flex', alignItems: 'center'}}>{t.rating} <StarIcon sx={{color: 'gold', ml: 0.5}} /></Box></TableCell>
                <TableCell>
                  <Switch checked={t.is_visible} onChange={() => handleVisibilityChange(t)} />
                </TableCell>
                <TableCell align="right">
                  <IconButton color="error" onClick={() => handleDelete(t.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default AdminTestimonialsPage;