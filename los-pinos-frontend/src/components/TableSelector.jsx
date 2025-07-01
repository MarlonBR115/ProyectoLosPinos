import React, { useState } from 'react';
import { Button, Typography, Box, Tabs, Tab, Paper } from '@mui/material';

function TableSelector({ tables, selectedTableId, onSelectTable }) {
  const [zona, setZona] = useState('salón'); // Estado inicial

  const handleChange = (event, newValue) => {
    setZona(newValue);
  };

  const zonas = [...new Set(tables.map(t => t.location))];
  const mesasFiltradas = tables.filter(table => table.location === zona);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        1. Seleccione Zona y Mesa:
      </Typography>
      <Paper>
        <Tabs value={zona} onChange={handleChange} centered>
          {zonas.map(z => <Tab label={z.charAt(0).toUpperCase() + z.slice(1)} value={z} key={z}/>)}
        </Tabs>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
            gap: 1.5,
            p: 2,
          }}
        >
          {mesasFiltradas.sort((a, b) => a.id - b.id).map((table) => (
            <Button
              key={table.id}
              variant={table.id === selectedTableId ? "contained" : "outlined"}
              color="primary"
              onClick={() => onSelectTable(table.id)}
              sx={{
                aspectRatio: '1 / 1',
                minWidth: 0,
                padding: 0,
                flexDirection: 'column'
              }}
            >
              <Typography variant="h6">{table.id}</Typography>
              <Typography variant="caption">({table.capacity}p)</Typography>
            </Button>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}

export default TableSelector;