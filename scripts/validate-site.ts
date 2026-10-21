import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { ARTICLES_METADATA } from '../src/content/articles/metadata';
import { TRANSLATIONS } from '../src/context/LanguageContext';
import { getArticleCanonicalUrl, getArticleLanguageUrls, getPageSEO, formatMetaDescription, SITE_URL } from '../src/lib/seo';
import { isArticleCategory } from '../src/lib/articleCategories';
import { parseRadarSource } from '../src/lib/radar';
import { STATIC_ROUTE_PATHS } from './static-route-pages';

const dist = path.resolve('dist');
const languages = ['en', 'pt', 'es'] as const;
const published = ARTICLES_METADATA.filter(article => article.published === true);
const read = (file: string) => fs.readFileSync(path.join(dist, file), 'utf8');
const documentFor = (file: string) => new JSDOM(read(file)).window.document;
const only = (document: Document, selector: string) => {
  const nodes = document.querySelectorAll(selector);
  assert.equal(nodes.length, 1, `Expected exactly one ${selector}`);
  return nodes[0];
};
const keys = (value: unknown, prefix = ''): string[] => value && typeof value === 'object'
  ? Object.entries(value).flatMap(([key, child]) => keys(child, `${prefix}.${key}`)).sort()
  : [prefix];

for (const language of languages) {
  assert.deepEqual(keys(TRANSLATIONS[language]), keys(TRANSLATIONS.en), `Incomplete translations: ${language}`);
  const { nav, hero, home, about, footer, insights, projects } = TRANSLATIONS[language];
  assert.doesNotMatch(JSON.stringify({ nav, hero, home, about, footer, insights, projects }),
    /Digital Research Lab|Research Lab|desenvolvidos pelo laboratório|developed by the lab|propios del laboratorio/i);
}
for (const article of ARTICLES_METADATA) assert.ok(isArticleCategory(article.category), article.slug);
parseRadarSource(fs.readFileSync('src/content/radar.json', 'utf8'));

const sitemap = new JSDOM(read('sitemap.xml'), { contentType: 'text/xml' }).window.document;
assert.equal(sitemap.querySelector('parsererror'), null);
const locations = [...sitemap.querySelectorAll('loc')].map(node => node.textContent!);
assert.equal(new Set(locations).size, locations.length);
assert.equal(locations.length, 5 + published.length * 3);
for (const route of ['/', '/articles', '/insights', '/projects', '/about']) {
  assert.ok(locations.includes(`${SITE_URL}${route}`));
}
for (const route of STATIC_ROUTE_PATHS) {
  const document = documentFor(`${route.slice(1)}.html`);
  const expected = getPageSEO(route);
  assert.equal(document.title, expected.title);
  assert.equal(only(document, 'link[rel="canonical"]').getAttribute('href'), expected.canonical);
  assert.equal(only(document, 'meta[name="description"]').getAttribute('content'), expected.description);
  if (route === '/admin' || route === '/research') {
    assert.equal(only(document, 'meta[name="robots"]').getAttribute('content'), 'noindex, follow');
  }
}
let prerendered = 0;
for (const article of ARTICLES_METADATA) {
  for (const language of languages) {
    const file = `${language}/articles/${article.slug}.html`;
    if (!article.published) {
      assert.equal(fs.existsSync(path.join(dist, file)), false, `Draft HTML: ${file}`);
      assert.ok(!locations.includes(getArticleCanonicalUrl(article.slug, language)));
      continue;
    }
    const document = documentFor(file);
    const translated = article.translations?.[language];
    const title = translated?.title ?? article.title;
    const summary = translated?.summary ?? article.summary;
    const canonical = getArticleCanonicalUrl(article.slug, language);
    assert.equal(document.title, `${title} | OT-SEC`);
    assert.equal(only(document, 'link[rel="canonical"]').getAttribute('href'), canonical);
    assert.equal(only(document, 'meta[property="og:url"]').getAttribute('content'), canonical);
    assert.equal(only(document, 'meta[name="description"]').getAttribute('content'), formatMetaDescription(summary));
    assert.equal(document.documentElement.lang, language === 'pt' ? 'pt-BR' : language);
    assert.ok(locations.includes(canonical));
    const urls = getArticleLanguageUrls(article.slug);
    for (const [code, href] of Object.entries({ ...urls, 'x-default': urls.en })) {
      const hreflang = code === 'pt' ? 'pt-BR' : code;
      assert.equal(only(document, `link[hreflang="${hreflang}"]`).getAttribute('href'), href);
    }
    const schema = JSON.parse(only(document, 'script[type="application/ld+json"]').textContent!);
    assert.equal(schema['@type'], 'Article');
    assert.equal(schema.publisher.name, 'OT-SEC');
    assert.equal(schema.headline, title);
    assert.equal(schema.url, canonical);
    assert.equal(schema.mainEntityOfPage, canonical);
    assert.equal(schema.inLanguage, language === 'pt' ? 'pt-BR' : language);
    assert.equal(schema.datePublished, article.date);
    assert.equal(schema.description, summary);
    assert.ok(only(document, '[data-prerendered-article]').textContent!.length > summary.length + title.length);
    for (const link of document.querySelectorAll('a[href^="/"]')) {
      const url = new URL(link.getAttribute('href')!, SITE_URL);
      const route = decodeURIComponent(url.pathname);
      assert.ok(route === '/' || STATIC_ROUTE_PATHS.includes(route)
        || fs.existsSync(path.join(dist, `${route.slice(1)}.html`))
        || fs.existsSync(path.join(dist, route.slice(1))), `Broken internal link: ${route}`);
    }
    prerendered++;
  }
}
const notFound = documentFor('404.html');
assert.equal(notFound.querySelector('link[rel="canonical"]'), null);
assert.equal(only(notFound, 'meta[name="robots"]').getAttribute('content'), 'noindex, follow');
assert.ok(notFound.querySelector('main h1'));
assert.match(read('_redirects'), /\/articles\/\* \/en\/articles\/:splat 301/);
for (const article of published.filter(article => article.id !== article.slug)) {
  for (const language of languages) assert.ok(read('_redirects').includes(
    `/${language}/articles/${article.id} /${language}/articles/${article.slug} 301`));
}
console.log(`Site audit passed: 3 languages, ${ARTICLES_METADATA.length} classified entries, ${locations.length} sitemap URLs, ${prerendered} prerendered articles, canonical/hreflang/JSON-LD, legacy routes and 404.`);
