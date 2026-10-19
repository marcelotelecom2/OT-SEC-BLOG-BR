const LOCAL_RASTER = /^(\/images\/articles\/[^?#]+)\.(?:jpe?g|png|webp)(?:[?#].*)?$/i;
const WIDTHS = [480, 960, 1600] as const;

export interface ResponsiveImageSources {
  src: string;
  srcSet?: string;
  type?: string;
}

export function getResponsiveImageSources(src: string): ResponsiveImageSources {
  const local = src.match(LOCAL_RASTER);
  if (local && !/\.\d+w$/i.test(local[1])) {
    const candidates = WIDTHS.map(width => `${local[1]}.${width}w.webp ${width}w`).join(', ');
    return { src, srcSet: candidates, type: 'image/webp' };
  }

  try {
    const url = new URL(src);
    if (url.hostname === 'images.unsplash.com') {
      const candidate = (width: number) => {
        const sized = new URL(url);
        sized.searchParams.set('w', String(width));
        sized.searchParams.set('q', '76');
        sized.searchParams.set('fm', 'webp');
        sized.searchParams.set('auto', 'format');
        return `${sized.toString()} ${width}w`;
      };
      return { src, srcSet: WIDTHS.map(candidate).join(', '), type: 'image/webp' };
    }
  } catch { /* A relative non-article URL keeps its original source. */ }

  return { src };
}

export function getOptimizedSocialImage(src?: string): string | undefined {
  if (!src) return undefined;
  const local = src.match(LOCAL_RASTER);
  return local ? `${local[1]}.1600w.webp` : src;
}
