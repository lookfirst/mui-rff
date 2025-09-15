import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

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
			fileName: (format) =>
				`mui-rff.${format === 'es' ? 'esm' : 'cjs'}.js`,
		},
		rollupOptions: {
			external: [/node_modules/, /react/, /@mui/, /react-final-form/],
		},
		sourcemap: true,
		outDir: 'dist',
		emptyOutDir: true,
	},
	esbuild: {
		jsx: 'automatic',
	},
});
