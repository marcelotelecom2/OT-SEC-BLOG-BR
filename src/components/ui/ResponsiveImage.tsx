import type { ImgHTMLAttributes } from 'react';
import { getResponsiveImageSources } from '../../lib/responsiveImage';

type ResponsiveImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> & {
  src: string;
  sizes: string;
};

export function ResponsiveImage({ src, sizes, width = 1600, height = 900, alt = '', ...props }: ResponsiveImageProps) {
  const responsive = getResponsiveImageSources(src);
  const image = <img src={responsive.src} alt={alt} width={width} height={height} sizes={sizes} {...props} />;
  if (!responsive.srcSet) return image;
  return (
    <picture className="contents">
      <source type={responsive.type} srcSet={responsive.srcSet} sizes={sizes} />
      {image}
    </picture>
  );
}
