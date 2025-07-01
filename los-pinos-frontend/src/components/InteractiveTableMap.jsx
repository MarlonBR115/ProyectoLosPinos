// src/components/InteractiveTableMap.jsx

import React from 'react';
import { Box, Typography, Button, Paper, useTheme, useMediaQuery } from '@mui/material';
import { Armchair, Tree, Buildings } from '@phosphor-icons/react';

const zoneStyles = {
  'salón': {
    icon: <Buildings />,
    color: '#6D4C41', 
    bgColor: 'rgba(117, 83, 70, 0.08)',
  },
  'patio': {
    icon: <Armchair />,
    color: '#616161', 
    bgColor: 'rgba(120, 120, 120, 0.08)',
  },
  'aire libre': {
    icon: <Tree />,
    color: '#2E7D32', 
    bgColor: 'rgba(46, 125, 50, 0.08)',
  }
};

const Mesa = ({ table, isSelected, onSelectTable }) => (
  <Button
    variant={isSelected ? "contained" : "outlined"}
    color="primary"
    onClick={() => onSelectTable(table.id)}
    sx={{
      width: '100%',
      height: '100%',
      minWidth: 0,
      padding: 0.5,
      flexDirection: 'column',
      border: isSelected ? '2px solid' : '1px solid',
      borderColor: isSelected ? 'secondary.main' : 'primary.light',
      aspectRatio: '1.5 / 1',
    }}
  >
    <Typography variant="body2" fontWeight="bold">{table.id}</Typography>
    <Typography variant="caption">({table.capacity}p)</Typography>
  </Button>
);

function InteractiveTableMap({ tables, selectedTableId, onSelectTable }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const mesasSalon = tables.filter(t => t.location === 'salón');
  const mesasPatio = tables.filter(t => t.location === 'patio');
  const mesasAireLibre = tables.filter(t => t.location === 'aire libre');

  return (
    <Box sx={{ mt: 4, width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        1. Seleccione una Mesa en el Mapa:
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        gap: 2, 
        alignItems: 'flex-start' // Cambiamos a flex-start para que los contenedores no se estiren
      }}>

        {/* --- MAPA DEL SALÓN (con nuevo estilo) --- */}
        <Paper variant="outlined" sx={{
          p: 2, 
          flex: isMobile ? '1 1 auto' : '0 1 35%',
          backgroundColor: zoneStyles['salón'].bgColor,
          borderColor: zoneStyles['salón'].color,
          borderWidth: 2,
        }}>
          <Typography variant="h6" align="center" gutterBottom sx={{ color: zoneStyles['salón'].color, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            {zoneStyles['salón'].icon} Salón
          </Typography>
          {/* ---- MODIFICACIÓN: La cuadrícula ahora tiene 4 filas ---- */}
          <Box sx={{
            position: 'relative', 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)',
            gridTemplateRows: 'repeat(4, auto)', // Se definen 4 filas
            gap: 1.5, 
            p: 2,
          }}>
            <Box sx={{ position: 'absolute', right: 0, top: '25%', height: '50%', width: '4px', backgroundColor: 'error.main', borderRadius: '2px' }} />
            {mesasSalon.map(table => (
              <Box key={table.id}><Mesa table={table} isSelected={selectedTableId === table.id} onSelectTable={onSelectTable} /></Box>
            ))}
          </Box>
        </Paper>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          
          {/* --- MAPA DE ZONA AL AIRE LIBRE --- */}
          <Paper variant="outlined" sx={{
            p: 2,
            backgroundColor: zoneStyles['aire libre'].bgColor,
            borderColor: zoneStyles['aire libre'].color,
            borderWidth: 2,
          }}>
            <Typography variant="h6" align="center" gutterBottom sx={{ color: zoneStyles['aire libre'].color, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              {zoneStyles['aire libre'].icon} Aire Libre
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, p: 2 }}>
              {mesasAireLibre.map(table => (
                <Box key={table.id}><Mesa table={table} isSelected={selectedTableId === table.id} onSelectTable={onSelectTable} /></Box>
              ))}
            </Box>
          </Paper>

          {/* --- MAPA DEL PATIO PRINCIPAL --- */}
          <Paper variant="outlined" sx={{
            p: 2,
            backgroundColor: zoneStyles['patio'].bgColor,
            borderColor: zoneStyles['patio'].color,
            borderWidth: 2,
          }}>
            <Typography variant="h6" align="center" gutterBottom sx={{ color: zoneStyles['patio'].color, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              {zoneStyles['patio'].icon} Patio Principal
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, p: 2 }}>
              {mesasPatio.map(table => (
                <Box key={table.id}><Mesa table={table} isSelected={selectedTableId === table.id} onSelectTable={onSelectTable} /></Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default InteractiveTableMap;