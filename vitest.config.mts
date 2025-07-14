import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: [],
		include: ['test/**/*.test.{ts,tsx}'],
		coverage: {
			reporter: ['text'],
		},
	},
});
