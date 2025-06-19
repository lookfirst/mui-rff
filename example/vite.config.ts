import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'mui-material': ['@mui/material', '@mui/system'],
          'x-date-pickers': ['@mui/x-date-pickers'],
        },
      },
    },
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