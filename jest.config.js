module.exports = {
	roots: ['<rootDir>'],
	testMatch: ['<rootDir>/**/*.test.{ts,tsx}'],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest',
	},
	setupFilesAfterEnv: ['./jest.setup.js'],
	testEnvironment: 'jsdom',
	verbose: false,
	reporters: ['default', ['jest-summary-reporter', { failuresOnly: true }]],
};
