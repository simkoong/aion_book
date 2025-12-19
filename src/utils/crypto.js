/**
 * Computes SHA-256 hash of a string.
 * @param {string} message - The string to hash.
 * @returns {Promise<string>} - The hex string of the hash.
 */
export const hashPassword = async (message) => {
    if (!message) return null;
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
};
