import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // This is the line that's missing
    baseUrl: 'http://localhost:5173',

    // ⚠️ Make sure 5173 is the port your
    // frontend server is running on!

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
