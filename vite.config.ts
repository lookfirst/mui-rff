import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';

const externals = [
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
];

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
			external: (id) => externals.some((pkg) => id === pkg || id.startsWith(pkg + '/')),
		},
		sourcemap: true,
		outDir: 'dist',
		emptyOutDir: true,
	},
	esbuild: {
		jsx: 'automatic',
	},
});
