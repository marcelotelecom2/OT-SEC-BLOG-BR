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

test('final references have a subdued heading and preserve technical content and image paths', () => {
  for (const title of ['Referências', 'References', 'Referencias']) {
    const content = `## Technical section\n\nOriginal paragraph.\n\n![Original diagram](/images/diagram.webp)\n\n## ${title}\n\n1. **Official document** — [Source](https://example.org/document).`;
    const html = renderToStaticMarkup(<ArticleContent content={content} />);
    assert.match(html, /Original paragraph\./);
    assert.match(html, /src="\/images\/diagram.webp"/);
    assert.match(html, /id="references" class="text-base/);
    assert.match(html, /href="https:\/\/example.org\/document"/);
    assert.match(html, /rel="noopener noreferrer"/);
    assert.ok(html.indexOf('id="references"') > html.indexOf('src="/images/diagram.webp"'));
  }
  const noReferences = renderToStaticMarkup(<ArticleContent content="## Technical section\n\nOriginal body." />);
  assert.doesNotMatch(noReferences, /id="references"/);
});
