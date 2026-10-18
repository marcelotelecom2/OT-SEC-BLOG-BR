import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Article } from '../types';
import { mergeArticles, updateLocalArticle } from './articleState';

const article: Article = {
  id: '1', slug: 'published-article', title: 'Version A', summary: 'Original summary',
  content: 'Original body', area: 'OT Security', readTime: '5 min', date: '2026-10-18',
  published: true, views: 0,
};

test('reading a published article never creates a local content copy', () => {
  const local: Article[] = [];
  assert.strictEqual(updateLocalArticle(local, [article], article.id, { views: 1 }), local);
  assert.deepEqual(local, []);
});

test('reading an edited article never rewrites its locally saved content', () => {
  const local = [{ ...article, content: 'Unsaved publication work', published: false }];
  const before = structuredClone(local);
  assert.strictEqual(updateLocalArticle(local, [article], article.id, { views: 10 }), local);
  assert.deepEqual(local, before);
});

test('a returning reader sees a new deployment despite a stale browser snapshot', () => {
  const stored = JSON.parse(JSON.stringify([{ ...article, views: 4 }]));
  const deployed = { ...article, title: 'Version B', summary: 'Updated summary', content: 'Updated body' };
  const [visible] = mergeArticles([deployed], stored, [], { '1': 5 });
  assert.equal(visible.title, 'Version B');
  assert.equal(visible.summary, 'Updated summary');
  assert.equal(visible.content, 'Updated body');
  assert.equal(visible.views, 5);
  assert.equal(stored[0].content, 'Original body');
});

test('local edits remain available in Admin while public content follows the deployment', () => {
  const local = updateLocalArticle([], [article], '1', {
    title: 'Local edit', content: 'Work in progress', published: false, views: 8,
  });
  const [preview] = mergeArticles([article], local, [], { '1': 8 }, true);
  const [publicArticle] = mergeArticles([article], local, [], { '1': 8 });
  assert.equal(preview.title, 'Local edit');
  assert.equal(preview.content, 'Work in progress');
  assert.equal(preview.published, false);
  assert.equal(publicArticle.content, 'Original body');
  assert.equal(publicArticle.published, true);
  assert.equal(publicArticle.views, 8);
  assert.equal(local[0].views, 0);
});

test('browser-only articles and drafts remain available in Admin without duplicating published IDs', () => {
  const draft = { ...article, id: 'draft', slug: 'local-draft', published: false };
  const custom = { ...article, id: 'custom', slug: 'custom-article' };
  const local = [{ ...article, content: 'Old copy' }, draft, custom];
  const result = mergeArticles([article], local, [], {}, true);
  assert.equal(result.filter(item => item.id === '1').length, 1);
  assert.deepEqual(result.find(item => item.id === 'draft'), draft);
  assert.deepEqual(result.find(item => item.id === 'custom'), custom);
  assert.deepEqual(mergeArticles([article], local, [], {}), [article]);
});

test('zeroed view counts are respected and local deletions only affect Admin', () => {
  const source = [{ ...article, views: 25 }, { ...article, id: 'deleted' }];
  const result = mergeArticles(source, [], ['deleted'], { '1': 0 });
  assert.equal(result.length, 2);
  assert.equal(result[0].views, 0);
  assert.equal(mergeArticles(source, [], ['deleted'], {}, true).length, 1);
});

test('a snapshot of an article removed from a deployment cannot resurrect it publicly', () => {
  assert.deepEqual(mergeArticles([], [article], [], { '1': 4 }), []);
  assert.equal(mergeArticles([], [article], [], { '1': 4 }, true)[0].content, article.content);
});

test('editing an existing local draft preserves unrelated articles and metadata', () => {
  const draft = { ...article, id: 'draft', author: 'Researcher', tags: ['ICS'] };
  const local = [draft, article];
  const result = updateLocalArticle(local, [article], 'draft', { content: 'Revised draft' });
  assert.equal(result[0].content, 'Revised draft');
  assert.equal(result[0].author, 'Researcher');
  assert.deepEqual(result[0].tags, ['ICS']);
  assert.strictEqual(result[1], article);
  assert.equal(draft.content, 'Original body');
});

test('empty or unknown updates do not create phantom local articles', () => {
  const local: Article[] = [];
  assert.strictEqual(updateLocalArticle(local, [article], '1', {}), local);
  assert.strictEqual(updateLocalArticle(local, [article], 'missing', { content: 'Text' }), local);
});
