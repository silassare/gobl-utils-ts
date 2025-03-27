import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsEslint from 'typescript-eslint';

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
	{
		name: 'use/files-to-lint',
		files: ['**/*.{ts,mts,tsx,vue,js,mjs}'],
		ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
	},
	...tsEslint.configs.recommended,
	js.configs.recommended,
	{
		name: 'use/ts-parser',
		plugins: {
			'@typescript-eslint': tsEslintPlugin,
		},
		languageOptions: {
			parser: tsParser,
		},
	},
	{
		name: 'use/default-configs',
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
		},
		rules: {
			// no-undef: this is already handled by typescript
			'no-undef': 0,
			'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
			'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
			'radix': 0,
			'one-var-declaration-per-line': 0,
			'no-mixed-spaces-and-tabs': 0,
			'no-bitwise': 0,
			'no-unused-vars': 0,
			'@typescript-eslint/no-explicit-any': 0,
			'@typescript-eslint/interface-name': 0,
			'@typescript-eslint/explicit-function-return-type': 0,
			'@typescript-eslint/no-this-alias': 0,
			'@typescript-eslint/no-empty-interface': 0,
			'@typescript-eslint/no-empty-object-type': 0,
			'@typescript-eslint/no-unused-vars': 0,
			'@typescript-eslint/no-unused-expressions': 0,
		},
	},
];
