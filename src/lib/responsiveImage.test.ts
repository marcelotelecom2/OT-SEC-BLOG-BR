import assert from 'node:assert/strict';
import test from 'node:test';
import { getOptimizedSocialImage, getResponsiveImageSources } from './responsiveImage';

test('local article images receive predictable responsive WebP candidates', () => {
  const result = getResponsiveImageSources('/images/articles/cover.jpg');
  assert.equal(result.type, 'image/webp');
  assert.match(result.srcSet ?? '', /cover\.480w\.webp 480w/);
  assert.match(result.srcSet ?? '', /cover\.1600w\.webp 1600w/);
  assert.equal(getOptimizedSocialImage('/images/articles/cover.jpg'), '/images/articles/cover.1600w.webp');
});

test('Unsplash images use its responsive transformation API', () => {
  const result = getResponsiveImageSources('https://images.unsplash.com/photo-example?w=1200&q=80');
  assert.match(result.srcSet ?? '', /w=480/);
  assert.match(result.srcSet ?? '', /w=1600/);
  assert.match(result.srcSet ?? '', /fm=webp/);
});
