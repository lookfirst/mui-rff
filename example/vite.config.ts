import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

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
				manualChunks(id) {
					if (
						id.includes('/node_modules/@mui/material/') ||
						id.includes('/node_modules/@mui/system/')
					) {
						return 'mui-material';
					}

					if (id.includes('/node_modules/@mui/x-date-pickers/')) {
						return 'x-date-pickers';
					}
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
			'@mui/system',
		],
		alias: {
			'mui-rff': path.resolve(import.meta.dirname, '../src/index.tsx'),
		},
	},
	optimizeDeps: {
		include: ['mui-rff'],
	},
});
