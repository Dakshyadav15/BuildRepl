// backend/utils/helpers.test.js
import { formatEmail } from './helpers.js';

// A 'describe' block groups related tests together
describe('formatEmail Utility', () => {
  // 'test' or 'it' defines an individual test case
  test('should trim whitespace and convert to lowercase', () => {
    const input = '  Test@Email.COM  ';
    const expectedOutput = 'test@email.com';

    // 'expect' is the assertion. We expect the result...
    // ...'.toBe()' the value we defined.
    expect(formatEmail(input)).toBe(expectedOutput);
  });

  test('should handle null input gracefully', () => {
    expect(formatEmail(null)).toBe(null);
  });

  test('should handle non-string input (number) gracefully', () => {
    expect(formatEmail(12345)).toBe(null);
  });

  test('should return correct format for already-clean email', () => {
    expect(formatEmail('clean@example.com')).toBe('clean@example.com');
  });
});
