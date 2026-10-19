import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Article } from '../types';
import { localizeArticle } from './articleLocalization';

const article: Article = {
  id: '1', slug: 'artigo', title: 'Título original', summary: 'Resumo original',
  content: 'Corpo em português', area: 'OT', readTime: '3 min', date: '2026-10-19',
  published: true, sourceLanguage: 'pt',
  translations: {
    en: { title: 'English title', summary: 'English summary' },
    es: { title: 'Título español', summary: 'Resumen español', content: 'Cuerpo en español' },
  },
};

test('the original language keeps the canonical article unchanged', () => {
  const result = localizeArticle(article, 'pt');
  assert.equal(result.article, article);
  assert.equal(result.bodyTranslated, true);
  assert.equal(result.contentLanguage, 'pt');
});

test('metadata-only translations never disguise the canonical body language', () => {
  const result = localizeArticle(article, 'en');
  assert.equal(result.article.title, 'English title');
  assert.equal(result.article.summary, 'English summary');
  assert.equal(result.article.content, 'Corpo em português');
  assert.equal(result.metadataTranslated, true);
  assert.equal(result.bodyTranslated, false);
  assert.equal(result.contentLanguage, 'pt');
});

test('a complete translation changes title, summary and body together', () => {
  const result = localizeArticle(article, 'es');
  assert.equal(result.article.title, 'Título español');
  assert.equal(result.article.content, 'Cuerpo en español');
  assert.equal(result.bodyTranslated, true);
  assert.equal(result.contentLanguage, 'es');
});

test('a missing translation uses the original version and reports its language', () => {
  const result = localizeArticle({ ...article, translations: undefined }, 'en');
  assert.equal(result.article.title, article.title);
  assert.equal(result.metadataTranslated, false);
  assert.equal(result.contentLanguage, 'pt');
});
