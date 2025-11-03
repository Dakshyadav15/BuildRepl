// frontend/src/setupTests.js
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// This imports all the DOM matchers (e.g., .toBeInTheDocument)
// and adds them to Vitest's 'expect'
import '@testing-library/jest-dom/vitest';

// This is a standard cleanup task. It "unmounts" all components
// rendered during a test to ensure tests don't affect each other.
afterEach(() => {
  cleanup();
});
