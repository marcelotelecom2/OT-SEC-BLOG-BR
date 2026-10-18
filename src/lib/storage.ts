/**
 * Safe localStorage and image compression utilities.
 * Protects against QuotaExceededError and prevents crashes in sandboxed iframe environments.
 */

export function safeGetItem(key: string): string | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    return localStorage.getItem(key);
  } catch (err) {
    console.warn(`[Storage] Could not read "${key}" from localStorage:`, err);
    return null;
  }
}

export function safeSetItem(key: string, value: string): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err: any) {
    console.warn(`[Storage] Failed to save "${key}" to localStorage:`, err?.message || err);
    // If quota exceeded, attempt to clear non-essential caches to make room
    try {
      if (key === 'ot_sec_local_articles') {
        // Articles are highest priority. Remove non-essential logs/media cache to save article
        localStorage.removeItem('ot_sec_media');
        localStorage.removeItem('ot_sec_analytics');
        localStorage.setItem(key, value);
        return true;
      }
    } catch {
      // ignore secondary failure
    }
    return false;
  }
}

export function safeRemoveItem(key: string): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`[Storage] Could not remove "${key}":`, err);
  }
}

/**
 * Compresses an image file (e.g. from camera or screenshot) down to an optimized WebP/JPEG,
 * typically under 120KB, preventing localStorage QuotaExceededError crashes.
 */
export async function compressImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 800,
  quality = 0.82
): Promise<{ url: string; sizeStr: string; type: string }> {
  // If SVG, don't re-compress on canvas
  if (file.type === 'image/svg+xml') {
    const url = await fileToDataUrl(file);
    return { url, sizeStr: formatBytes(file.size), type: file.type };
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        fileToDataUrl(file).then((url) => {
          resolve({ url, sizeStr: formatBytes(file.size), type: file.type });
        });
        return;
      }

      // Fill white/dark background for transparency handling if needed
      ctx.drawImage(img, 0, 0, width, height);

      // Prefer image/webp or fallback to image/jpeg
      const outputType = 'image/webp';
      let dataUrl = canvas.toDataURL(outputType, quality);

      // If browser doesn't support webp dataURL, fallback to jpeg
      if (!dataUrl.startsWith('data:image/webp')) {
        dataUrl = canvas.toDataURL('image/jpeg', quality);
      }

      // Approximate size from base64 string
      const sizeBytes = Math.round((dataUrl.length * 3) / 4);
      resolve({
        url: dataUrl,
        sizeStr: formatBytes(sizeBytes),
        type: outputType,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      fileToDataUrl(file).then((url) => {
        resolve({ url, sizeStr: formatBytes(file.size), type: file.type });
      });
    };

    img.src = objectUrl;
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes: number): string {
  if (bytes > 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.round(bytes / 1024)} KB`;
}
