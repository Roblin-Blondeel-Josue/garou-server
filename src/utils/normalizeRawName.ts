/**
 * Prepares a string for database storage by removing accents, special characters and spaces,
 * then converting to lower case.
 *
 * @param {string} name - The string to process.
 * @returns {string} The processed string, suitable for database storage.
 *
 */
export const normalizeRawName = (name: string): string => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
};
