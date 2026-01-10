/**
 * Escape special regex characters to prevent ReDoS attacks
 * @param str - The string to escape
 * @returns Escaped string safe for use in $regex queries
 */
export const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Validate that a string is a valid MongoDB ObjectId
 * @param id - The string to validate
 * @returns true if valid ObjectId format
 */
export const isValidObjectId = (id: string): boolean => {
  return /^[a-fA-F0-9]{24}$/.test(id);
};

