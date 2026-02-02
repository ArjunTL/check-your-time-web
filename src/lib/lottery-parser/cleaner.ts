/**
 * Normalizes text extracted from PDF.
 * - Fixes line breaks that split headers.
 * - Standardizes spacing.
 */
export function normalizeText(text: string): string {
  if (!text) return "";

  let clean = text
    .replace(/\r\n/g, "\n")
    // Replace non-breaking spaces
    .replace(/\u00A0/g, " ");

  // Fix split headers (e.g. "1st \n Prize")
  // This is valid javascript regex to join lines
  clean = clean.replace(/(\d+(?:st|nd|rd|th))\s*\n\s*(Prize)/gi, "$1 $2");

  // Fix "Rs \n :100"
  clean = clean.replace(/(Rs)\s*\n\s*(:)/gi, "$1 $2");

  // Standardize spacing around colons
  clean = clean.replace(/\s*:\s*/g, ": ");

  return clean;
}

/**
 * Heuristic to split "mashed" number strings found in some PDFs
 * e.g. "046617052024" -> ["0466", "1705", "2024"]
 * Assuming 4-digit numbers as that's the common case for lower tier mashed prizes
 */
export function chunkMashedNumbers(text: string): string[] {
  // Only process if it looks like a long string of digits
  // We assume these are 4-digit endings.
  const chunks: string[] = [];
  // Remove all whitespace
  const clean = text.replace(/\s+/g, "");

  // Must be multiple of 4 to be clean 4-digit chunks
  if (clean.length % 4 === 0 && /^\d+$/.test(clean)) {
    for (let i = 0; i < clean.length; i += 4) {
      chunks.push(clean.substring(i, i + 4));
    }
  } else {
    // Fallback: just return the original if we aren't sure
    // Or specific handling if there are cases of 5 digit endings?
    // For now, let's assume 4 digits as per user example.
    // Even if not perfect multiple, try to chunk as much as possible?
    // No, safer to return empty or handle elsewhere if not matching.
    // Let's iterate.
    for (let i = 0; i < clean.length; i += 4) {
      if (i + 4 <= clean.length) {
        chunks.push(clean.substring(i, i + 4));
      }
    }
  }
  return chunks;
}
