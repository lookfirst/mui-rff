module.exports = {
	roots: ['<rootDir>'],
	testMatch: ['<rootDir>/**/*.test.{ts,tsx}'],
	transform: {
		'^.+\\.(ts|tsx)$': ['ts-jest', {
			tsconfig: {
				jsx: 'react',
				esModuleInterop: true,
				allowSyntheticDefaultImports: true,
				skipLibCheck: true,
        isolatedModules: true,
			},
		}],
	},
	testEnvironment: 'jsdom',
	verbose: false,
	reporters: ['default', ['jest-summary-reporter', { failuresOnly: true }]],
};
