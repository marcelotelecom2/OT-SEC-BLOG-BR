/**
 * Safe localStorage and image compression utilities.
 * Protects against QuotaExceededError and prevents crashes in sandboxed iframe environments.
 */

export { safeGetItem, safeSetItem, safeRemoveItem } from './persistence';

/**
 * Compresses an image file (e.g. from camera or screenshot) down to an optimized WebP/JPEG,
 * typically under 120KB, preventing localStorage QuotaExceededError crashes.
 */
export async function compressImageFile(
  file: File,
  maxWidth = 1600,
  maxHeight = 1200,
  quality = 0.82
): Promise<{ url: string; sizeStr: string; type: string }> {
  // Preserve vector images and GIF animation.
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    const url = await fileToDataUrl(file);
    return { url, sizeStr: formatBytes(file.size), type: file.type };
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      try {
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
        }).catch(reject);
        return;
      }

      // Fill white/dark background for transparency handling if needed
      ctx.drawImage(img, 0, 0, width, height);

      // Prefer image/webp or fallback to image/jpeg
      let outputType = 'image/webp';
      let dataUrl = canvas.toDataURL(outputType, quality);

      // If browser doesn't support webp dataURL, fallback to jpeg
      if (!dataUrl.startsWith('data:image/webp')) {
        outputType = 'image/jpeg';
        dataUrl = canvas.toDataURL(outputType, quality);
      }

      // Approximate size from base64 string
      const sizeBytes = Math.round((dataUrl.length * 3) / 4);
      resolve({
        url: dataUrl,
        sizeStr: formatBytes(sizeBytes),
        type: outputType,
      });
      } catch (error) { reject(error); }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Não foi possível abrir a imagem. A edição foi mantida.'));
    };

    img.src = objectUrl;
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
    reader.onabort = () => reject(new Error('A leitura da imagem foi cancelada.'));
    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes: number): string {
  if (bytes > 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.round(bytes / 1024)} KB`;
}
