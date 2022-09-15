module.exports = {
	roots: ['<rootDir>'],
	testMatch: ['<rootDir>/**/*.test.{ts,tsx}'],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest',
	},
	testEnvironment: 'jsdom',
	verbose: false,
	reporters: ['default', ['jest-summary-reporter', { failuresOnly: true }]],
};
