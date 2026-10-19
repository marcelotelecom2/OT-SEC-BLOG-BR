import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseArticleExport, serializeArticleExport } from './articleExport';
import type { Article } from '../types';

const article: Article = {
  id: '42', slug: 'seguranca-ot', title: 'Segurança OT', summary: 'Resumo técnico do artigo.',
  content: '# Pesquisa\n\nConteúdo com acentos: proteção.', area: 'OT', readTime: '5 min',
  date: '2026-10-18', published: true, author: 'Walter Rodrigues', tags: ['ICS', 'SCADA'],
  updatedAt: '2026-10-18', coverImage: '/images/articles/capa.jpg', views: 100,
};

test('export round trip preserves editorial metadata and Markdown but excludes browser counters', () => {
  const packet = parseArticleExport(JSON.parse(serializeArticleExport(article)));
  const { views: _views, ...withoutViews } = article;
  const expected = { ...withoutViews, sourceLanguage: 'pt' };
  assert.deepEqual(packet.article, expected);
  assert.equal(packet.format, 'ot-sec-article');
  assert.equal(packet.version, 2);
});

test('drafts can be exported as portable editorial backups', () => {
  assert.equal(JSON.parse(serializeArticleExport({ ...article, published: false })).article.published, false);
});

test('invalid export versions and malformed fields are rejected', () => {
  const packet = JSON.parse(serializeArticleExport(article));
  assert.throws(() => parseArticleExport(null));
  assert.throws(() => parseArticleExport({ ...packet, version: 3 }));
  for (const change of [
    { slug: '../../outside' }, { title: ' ' }, { content: '' },
    { date: '2026-02-30' }, { date: 'not-a-date' }, { tags: [12] }, { published: 'true' },
    { coverImage: 'javascript:alert(1)' },
  ]) {
    assert.throws(() => parseArticleExport({ ...packet, article: { ...article, ...change } }));
  }
});

test('translations travel with the article and incomplete versions are rejected', () => {
  const translated = {
    ...article,
    sourceLanguage: 'pt' as const,
    translations: {
      en: { title: 'OT Security', summary: 'Technical summary.', content: '# Research\n\nTranslated body.' },
      es: { title: 'Seguridad OT', summary: 'Resumen técnico.' },
    },
  };
  assert.deepEqual(parseArticleExport(JSON.parse(serializeArticleExport(translated))).article.translations, translated.translations);
  const packet = JSON.parse(serializeArticleExport(article));
  assert.throws(() => parseArticleExport({ ...packet, article: { ...packet.article, translations: { en: { title: 'Only title' } } } }));
  assert.throws(() => parseArticleExport({ ...packet, article: { ...packet.article, sourceLanguage: 'de' } }));
});

test('unknown runtime properties are not copied to the publication package', () => {
  const output = JSON.parse(serializeArticleExport({ ...article, secret: 'local', contentFile: 'old.md' } as Article));
  assert.equal(output.article.secret, undefined);
  assert.equal(output.article.contentFile, undefined);
});
