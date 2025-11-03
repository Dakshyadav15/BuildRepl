import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,
  prettier,
  {
    files: ['**/*.js'],
    ignores: ['node_modules', 'dist'],
    languageOptions: {
      globals: {
        // Node.js globals
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',

        // Jest globals
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        jest: 'readonly',
        beforeEach: 'readonly',
        beforeAll: 'readonly',
        afterEach: 'readonly',
        afterAll: 'readonly',
      },
      // --- THIS IS THE FIX ---
      sourceType: 'module',
      // --- END OF FIX ---
    },
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      'no-unused-vars': 'warn',
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
