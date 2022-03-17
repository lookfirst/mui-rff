module.exports = {
	root: true,
	env: {
		node: true,
		es6: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
		sourceType: 'module', // Allows for the use of imports
		ecmaFeatures: {
			jsx: true, // Allows for the parsing of JSX
		},
	},
	plugins: [
		'react',
		'react-hooks',
		'unused-imports',
		'sort-imports-es6-autofix',
		'@typescript-eslint',
		'promise',
		'prettier',
	],
	extends: [
		'eslint:recommended',
		'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react,
		'plugin:react-hooks/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:promise/recommended',
		'prettier',
		'plugin:prettier/recommended',
	],
	settings: {
		react: {
			version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
		},
	},
	rules: {
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		// https://github.com/sweepline/eslint-plugin-unused-imports#usage
		'@typescript-eslint/no-unused-vars': 'off',
		'unused-imports/no-unused-imports': 'error',
		'unused-imports/no-unused-vars': [
			'warn',
			{ vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
		],

		// https://github.com/prettier/eslint-plugin-prettier#installation
		'prettier/prettier': 'error',

		// https://github.com/marudor/eslint-plugin-sort-imports-es6-autofix#usage
		'sort-imports-es6-autofix/sort-imports-es6': [
			2,
			{
				ignoreCase: false,
				ignoreMemberSort: false,
				memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
			},
		],
	},
};
