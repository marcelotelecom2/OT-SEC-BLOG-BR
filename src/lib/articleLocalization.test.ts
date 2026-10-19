import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Article } from '../types';
import { localizeArticle, localizeReadTime } from './articleLocalization';
import { resolveLanguageFromPath, resolveLanguagePreference } from '../context/LanguageContext';

const article: Article = {
  id: '1', slug: 'artigo', title: 'Título original', summary: 'Resumo original',
  content: 'Corpo em português', area: 'OT', readTime: '3 min', date: '2026-10-19',
  published: true, sourceLanguage: 'pt',
  translations: {
    en: { title: 'English title', summary: 'English summary' },
    es: { title: 'Título español', summary: 'Resumen español', content: 'Cuerpo en español' },
  },
};

test('the original language keeps canonical editorial content and localizes shared labels', () => {
  const result = localizeArticle(article, 'pt');
  assert.equal(result.article.title, article.title);
  assert.equal(result.article.summary, article.summary);
  assert.equal(result.article.content, article.content);
  assert.equal(result.article.readTime, '3 min de leitura');
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

test('a first visit defaults to English and valid saved choices restore Portuguese or Spanish', () => {
  assert.equal(resolveLanguagePreference(null), 'en');
  assert.equal(resolveLanguagePreference('invalid'), 'en');
  assert.equal(resolveLanguagePreference('pt'), 'pt');
  assert.equal(resolveLanguagePreference('es'), 'es');
  assert.equal(resolveLanguageFromPath('/en/articles/example'), 'en');
  assert.equal(resolveLanguageFromPath('/pt/articles/example'), 'pt');
  assert.equal(resolveLanguageFromPath('/es/articles/example'), 'es');
  assert.equal(resolveLanguageFromPath('/articles/example'), null);
});

test('reading time and article areas follow the selected interface language', () => {
  assert.equal(localizeReadTime('12 min de leitura', 'en'), '12 min read');
  assert.equal(localizeReadTime('12 min read', 'pt'), '12 min de leitura');
  assert.equal(localizeReadTime('12 min read', 'es'), '12 min de lectura');
  assert.equal(localizeArticle({ ...article, area: 'Regulation Update' }, 'es').article.area, 'Actualización Regulatoria');
});
