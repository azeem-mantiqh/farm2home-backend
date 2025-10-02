import tsEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier/recommended';

export default [
  {
    files: ['**/*.ts'],
    ignores: ['**/*.js', 'dist/**', 'node_modules/**'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsEslint,
    },
    rules: {
      ...tsEslint.configs['recommended'].rules,
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_', // Ignore unused args like `_foo`
          varsIgnorePattern: '^_', // Ignore unused variables like `_bar`
          caughtErrorsIgnorePattern: '^_', // Ignore unused catch params like `_err`
        },
      ],
    },
  },

  // Prettier integration
  {
    ...prettier,
    rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
];
