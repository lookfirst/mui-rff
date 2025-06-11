import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src/**/*'],
      exclude: ['**/*.test.*'],
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      formats: ['es', 'cjs'],
      fileName: (format) => `mui-rff.${format === 'es' ? 'esm' : 'cjs'}.js`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@mui/material',
        '@mui/system',
        '@mui/x-date-pickers',
        '@emotion/react',
        '@emotion/styled',
        'final-form',
        'react-final-form',
        '@date-io/core',
        '@date-io/date-fns',
        'date-fns',
        'yup',
      ],
    },
    sourcemap: true,
    outDir: 'dist',
    emptyOutDir: true,
  },
  esbuild: {
    jsx: 'automatic',
  },
}); 