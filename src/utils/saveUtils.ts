/**
 * Obfuscates a string using Base64.
 * Note: btoa is available in modern browsers and Node.js 16+.
 */
export function obfuscate(data: string): string {
  try {
    return btoa(unescape(encodeURIComponent(data)));
  } catch (e) {
    console.error('Obfuscation failed:', e);
    return data;
  }
}

/**
 * Deobfuscates a Base64 string.
 * Note: atob is available in modern browsers and Node.js 16+.
 */
export function deobfuscate(obfuscatedData: string): string {
  try {
    return decodeURIComponent(escape(atob(obfuscatedData)));
  } catch (e) {
    console.error('Deobfuscation failed:', e);
    return obfuscatedData;
  }
}

/**
 * Validates the structure of the game save data.
 */
export function validateSaveData(data: any): boolean {
  if (!data || typeof data !== 'object') return false;

  const requiredKeys = ['player', 'game', 'flags', 'inventory', 'logs', 'mapNodes'];
  for (const key of requiredKeys) {
    if (!(key in data)) {
      console.warn(`Save data validation failed: Missing key "${key}"`);
      return false;
    }
  }

  // Basic type checks for critical fields
  if (typeof data.player !== 'object') return false;
  if (typeof data.game !== 'object') return false;
  if (!Array.isArray(data.inventory)) return false;
  if (!Array.isArray(data.logs)) return false;

  return true;
}
