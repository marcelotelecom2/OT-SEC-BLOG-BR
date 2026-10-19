import assert from 'node:assert/strict';
import test from 'node:test';
import { buildArticleStructuredData, getArticleCanonicalUrl, getArticleLanguageUrls } from './seo';
import type { Article } from '../types';

const article: Article = {
  id: '1', slug: 'multilingual-article', title: 'Title', summary: 'Summary', content: 'Body',
  date: '2026-10-19', readTime: '1 min read', area: 'OT', published: true,
};

test('article URLs use explicit languages and English is the default canonical version', () => {
  assert.equal(getArticleCanonicalUrl(article.slug), 'https://ot-sec.blog.br/en/articles/multilingual-article');
  assert.deepEqual(getArticleLanguageUrls(article.slug), {
    en: 'https://ot-sec.blog.br/en/articles/multilingual-article',
    pt: 'https://ot-sec.blog.br/pt/articles/multilingual-article',
    es: 'https://ot-sec.blog.br/es/articles/multilingual-article',
  });
  const schema = buildArticleStructuredData(article, 'pt');
  assert.equal(schema.url, 'https://ot-sec.blog.br/pt/articles/multilingual-article');
  assert.equal(schema.inLanguage, 'pt-BR');
});
