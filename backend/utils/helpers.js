// backend/utils/helpers.js

/**
 * Trims and lowercases a string, designed for email formatting.
 * @param {string} email - The input email string.
 * @returns {string | null} The formatted email or null if input is invalid.
 */
export const formatEmail = (email) => {
  if (typeof email !== 'string') {
    return null; // Handle bad input
  }
  return email.trim().toLowerCase();
};
