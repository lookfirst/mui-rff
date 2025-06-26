import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginUnusedImports from 'eslint-plugin-unused-imports';
import pluginPromise from 'eslint-plugin-promise';
import pluginImport from 'eslint-plugin-import';
import pluginVitest from '@vitest/eslint-plugin';

export default [
	{
		ignores: [
			'node_modules/',
			'dist/',
			'example/',
			'*.d.ts',
			'types/',
			'**/*.d.ts',
			'.yarn/',
		],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: 'module',
				ecmaFeatures: { jsx: true },
				project: './tsconfig.json',
			},
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
			react: pluginReact,
			'react-hooks': pluginReactHooks,
			'unused-imports': pluginUnusedImports,
			promise: pluginPromise,
			import: pluginImport,
		},
		rules: {
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'unused-imports/no-unused-imports': 'error',
			'react/react-in-jsx-scope': 'off',
			'@typescript-eslint/await-thenable': 'warn',
			'@typescript-eslint/no-floating-promises': 'warn',
			'@typescript-eslint/require-await': 'warn',
			'@typescript-eslint/no-unnecessary-type-assertion': 'warn',
			'@typescript-eslint/no-unnecessary-type-arguments': 'warn',
			'@typescript-eslint/no-unnecessary-type-constraint': 'warn',
			'@typescript-eslint/no-useless-constructor': 'warn',
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'import/order': [
				'warn',
				{
					groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
					'newlines-between': 'always',
					alphabetize: { order: 'asc', caseInsensitive: true },
				},
			],
			'no-duplicate-imports': 'warn',
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
	{
		files: ['test/**/*.test.ts', 'test/**/*.test.tsx'],
		plugins: {
			vitest: pluginVitest,
		},
		rules: {
			...pluginVitest.configs.recommended.rules,
		},
	},
];
