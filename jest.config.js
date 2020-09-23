module.exports = {
	transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	collectCoverageFrom: ['src/**/*.{ts,tsx}'],
	testMatch: ['<rootDir>/**/*.(spec|test).{ts,tsx}'],
	rootDir: '.',
	setupFilesAfterEnv: ['./jest.setup.js'],
};
