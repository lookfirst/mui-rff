import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  resolve: {
    dedupe: [
      'react', 
      'react-dom', 
      'react-final-form', 
      'final-form', 
      '@mui/x-date-pickers',
      '@emotion/react',
      '@emotion/styled',
      '@mui/material',
      '@mui/system'
    ],
    alias: {
      'mui-rff': path.resolve(__dirname, '../src/index.tsx')
    }
  },
  optimizeDeps: {
    include: ['mui-rff']
  }
}); 