import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import pkg from './package.json' with { type: 'json' };

const externals = [
	...Object.keys(pkg.peerDependencies),
	...Object.keys(pkg.optionalDependencies),
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
			fileName: (format) =>
				`mui-rff.${format === 'es' ? 'esm' : 'cjs'}.js`,
		},
		rollupOptions: {
			external: (id) =>
				externals.some(
					(pkgStr) => id === pkgStr || id.startsWith(`${pkg}/`)
				),
		},
		sourcemap: true,
		outDir: 'dist',
		emptyOutDir: true,
	},
	esbuild: {
		jsx: 'automatic',
	},
});
