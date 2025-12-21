import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores([
    'dist',
    'functions',
    'scripts',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // This codebase uses incremental typing; keep lint helpful but non-blocking.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

      // Allow intentional empty catches/blocks used as fallbacks.
      'no-empty': 'warn',

      // Relax rules that are noisy in existing code.
      'no-case-declarations': 'warn',
      'prefer-const': 'warn',

      // Vite fast refresh rule is great for new code, but too noisy for mixed exports.
      'react-refresh/only-export-components': 'warn',
    },
  },
])
