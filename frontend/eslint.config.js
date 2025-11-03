import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginPrettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';
import pluginCypress from 'eslint-plugin-cypress'; // <-- NEW
import globals from 'globals'; // <-- NEW

export default [
  js.configs.recommended,
  configPrettier, // Disables conflicting style rules
  pluginCypress.configs.recommended, // <-- NEW: Adds Cypress globals (cy, describe, etc.)
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['node_modules', 'dist'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser, // <-- NEW: Adds browser globals (document, localStorage, etc.)
        es2021: true,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: pluginReact,
      prettier: pluginPrettier,
    },
    rules: {
      // Your existing rules
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': 'warn',

      // --- FIX for 'console' error ---
      'no-console': 'warn', // Dims console.log as a warning instead of an error

      // Your prettier rule
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          singleQuote: true,
          semi: true,
        },
      ],
    },
  },
];
