/* backend/jest.config.cjs */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(test).[jt]s'],
  transform: {},
  setupFilesAfterEnv: ['<rootDir>/test-setup.js'],
  coverageThreshold: {
    global: {
      lines: 54,
    },
  },
};