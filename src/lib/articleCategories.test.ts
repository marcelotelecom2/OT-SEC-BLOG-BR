import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Article } from '../types';
import { ARTICLES_METADATA } from '../content/articles/metadata';
import { filterStudyArticles, getArticleCategory, isArticleCategory } from './articleCategories';
import { parseArticleExport, serializeArticleExport } from './articleExport';

const standard: Article = {
  id: 'standard', slug: 'original-slug', title: 'Norma de proteção', summary: 'Resumo técnico',
  content: 'Unchanged Markdown', area: 'Technical Standards', category: 'standards',
  readTime: '3 min', date: '2026-10-18', published: true, sourceLanguage: 'pt', tags: ['IEC 62351'],
  translations: {
    en: { title: 'Protection standard', summary: 'Technical overview' },
    es: { title: 'Norma de protección', summary: 'Resumen técnico' },
  },
};
const paper: Article = { ...standard, id: 'paper', category: 'papers', area: 'Artificial Intelligence' };
const technical: Article = { ...standard, id: 'technical', category: 'technical' };
const draft: Article = { ...standard, id: 'draft', published: false };

test('category and search intersect, support localized accents and never expose drafts', () => {
  const articles = [standard, paper, technical, draft];
  for (const [language, query] of [['pt', 'PROTECAO IEC'], ['en', 'protection IEC'], ['es', 'proteccion IEC']] as const) {
    assert.deepEqual(filterStudyArticles(articles, language, 'standards', query).map(a => a.id), ['standard']);
    assert.equal(filterStudyArticles(articles, language, 'all', query).length, 3);
  }
  assert.deepEqual(filterStudyArticles(articles, 'en', 'papers', 'protection').map(a => a.id), ['paper']);
  assert.deepEqual(filterStudyArticles(articles, 'pt', 'technical', '').map(a => a.id), ['technical']);
  assert.equal(filterStudyArticles(articles, 'pt', 'standards', 'absent').length, 0);
  const [result] = filterStudyArticles(articles, 'en', 'standards', '');
  assert.equal(result.slug, standard.slug);
  assert.equal(result.content, standard.content);
  assert.equal(standard.title, 'Norma de proteção');
});

test('existing publications are explicitly classified by editorial nature', () => {
  for (const article of ARTICLES_METADATA) {
    assert.ok(isArticleCategory(article.category), article.slug);
    if (['6', '7', '8', '9', '10', '11', '12'].includes(article.id)) assert.equal(article.category, 'standards');
    if (['1', '2', '3', '4', '5'].includes(article.id)) assert.equal(article.category, 'technical');
  }
});

test('category survives export/import and legacy articles keep a compatible fallback', () => {
  for (const article of [standard, paper, technical]) {
    assert.equal(parseArticleExport(JSON.parse(serializeArticleExport(article))).article.category, article.category);
  }
  assert.equal(getArticleCategory({ area: 'Technical Standards' }), 'standards');
  assert.equal(getArticleCategory({ area: 'Paper Review' }), 'papers');
  assert.equal(getArticleCategory({ area: 'ICS Security' }), 'technical');
  assert.throws(() => parseArticleExport({ format: 'ot-sec-article', version: 2,
    article: { ...standard, category: 'invalid' } }), /Categoria/);
});
