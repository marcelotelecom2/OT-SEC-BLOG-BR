/**
 * Sanitizes external URLs to prevent Cross-Site Scripting (XSS).
 * Strictly validates that the URL uses 'http:' or 'https:' protocol,
 * discarding any 'javascript:', 'data:', 'vbscript:', or malformed inputs.
 */
export function sanitizeExternalUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Immediate protection against protocol-obfuscation attacks
  const stripped = trimmed.replace(/[\u0000-\u001F\u007F-\u009F\s]/g, '').toLowerCase();
  if (
    stripped.startsWith('javascript:') ||
    stripped.startsWith('data:') ||
    stripped.startsWith('vbscript:') ||
    stripped.startsWith('file:')
  ) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
  } catch {
    // Not a valid absolute URL with http or https protocol
    return null;
  }

  return null;
}
