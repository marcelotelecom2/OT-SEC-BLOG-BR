import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { ArticleContent } from './ArticleContent';

test('standalone Markdown images render as valid top-level figures', () => {
  const html = renderToStaticMarkup(<ArticleContent content={'Texto anterior.\n\n![Diagrama](/images/diagram.webp)\n\nTexto posterior.'} />);
  assert.match(html, /<figure/);
  assert.match(html, /<figcaption[^>]*>Diagrama<\/figcaption>/);
  assert.doesNotMatch(html, /<p[^>]*>\s*<figure/);
});
