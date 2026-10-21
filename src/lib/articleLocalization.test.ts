import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import type { Article } from '../types';
import { localizeArticle, localizeArticleArea, localizeReadTime } from './articleLocalization';
import { ARTICLES_METADATA } from '../content/articles/metadata';
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

test('published IEC studies use the same standards category in every language', () => {
  const studies = ARTICLES_METADATA.filter(item => item.published && item.slug.startsWith('iec-62351-'));
  assert.ok(studies.length >= 4, 'The original IEC studies must remain published as the series grows.');
  for (const metadata of studies) {
    assert.equal(metadata.area, 'Technical Standards');
    for (const language of ['en', 'pt', 'es'] as const) {
      const localized = localizeArticle({ ...metadata, content: 'Body' }, language).article;
      assert.equal(localized.area, localizeArticleArea(metadata.area, language));
      assert.equal(localized.area, language === 'en' ? 'Technical Standards' : 'Normas Técnicas');
      assert.equal(localized.slug, metadata.slug);
    }
  }
  assert.equal(ARTICLES_METADATA.find(item => item.id === '6')?.area, 'Technical Standards');
  assert.equal(localizeArticleArea('Regulation Update', 'pt'), 'Atualização Regulatória');
  assert.equal(localizeArticleArea('Vulnerability Analysis', 'pt'), 'Análise de Vulnerabilidades');
  assert.equal(localizeArticleArea('Custom area', 'pt'), 'Custom area');
});

test('the original IEC threat studies retain their summary, analysis and references in all languages', () => {
  const headings = {
    pt: ['Síntese da norma', 'Análise técnica', 'Referências'],
    en: ['Standard summary', 'Technical analysis', 'References'],
    es: ['Síntesis de la norma', 'Análisis técnico', 'Referencias'],
  };
  const scope = {
    pt: 'não estabelece exigências normativas adicionais',
    en: 'does not establish additional normative requirements',
    es: 'no establece exigencias normativas adicionales',
  };
  // These four existing articles use a shared editorial template. New IEC posts
  // can retain their supplied structure without rewriting the original series.
  const originalStudies = ARTICLES_METADATA.filter(item => item.published && ['9', '10', '11', '12'].includes(item.id));
  assert.equal(originalStudies.length, 4);
  for (const metadata of originalStudies) {
    for (const language of ['pt', 'en', 'es'] as const) {
      const filename = metadata.sourceLanguage === language ? metadata.contentFile : metadata.translations?.[language]?.contentFile;
      assert.ok(filename);
      const markdown = readFileSync(new URL(`../content/articles/${filename}`, import.meta.url), 'utf8');
      assert.deepEqual([...markdown.matchAll(/^## (.+)$/gm)].map(match => match[1]), headings[language]);
      assert.ok(markdown.includes(scope[language]));
      assert.ok(markdown.includes('https://webstore.iec.ch/en/publication/6903'));
    }
  }
});
