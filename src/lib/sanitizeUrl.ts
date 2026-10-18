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

  // Allow safe root-relative paths (e.g. /images/articles/...)
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
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

/**
 * Sanitizes image URLs specifically, allowing safe http/https URLs, safe root-relative paths,
 * and safe base64 image data URIs (e.g. data:image/jpeg;base64,..., data:image/gif;base64,..., data:image/png;base64,...).
 */
export function sanitizeImageUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Allow safe inline image data URLs (jpg, png, gif, webp, svg)
  if (/^data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,[A-Za-z0-9+/=]+$/i.test(trimmed)) {
    return trimmed;
  }

  return sanitizeExternalUrl(trimmed);
}
