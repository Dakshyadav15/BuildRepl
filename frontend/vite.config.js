// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // This makes test utilities (like 'describe', 'test', 'expect')
    // available globally, just like in Jest.
    globals: true,

    // This simulates a browser environment (the DOM) for our tests.
    environment: 'jsdom',

    // This points to our setup file.
    setupFiles: './src/setupTests.js',
  },
});