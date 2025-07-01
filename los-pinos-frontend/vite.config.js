import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ----> AÑADE ESTA SECCIÓN PARA OPTIMIZAR LA CONSTRUCCIÓN <----
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separa la librería @mui en su propio chunk para evitar el error EMFILE
          if (id.includes('@mui')) {
            return '@mui';
          }
        }
      }
    }
  }
})