// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // This makes test utilities (like 'describe', 'test', 'expect')
    // available globally, just like in Jest.
    globals: true,

    // Use happy-dom to avoid jsdom dependency issues in CI
    environment: 'happy-dom',

    // This points to our setup file.
    setupFiles: './src/setupTests.js',
  },
});
