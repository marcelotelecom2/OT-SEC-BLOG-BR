import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { getPageSEO } from '../src/lib/seo';
import { STATIC_ROUTE_PATHS, writeStaticRoutePages } from './static-route-pages';

test('the 404 fallback has readable content, recovery links and no homepage canonical', () => {
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-sec-routing-'));
  try {
    const template = '<!doctype html><html lang="en"><head><title>OT-SEC</title><meta name="robots" content="index, follow"><link rel="canonical" href="https://ot-sec.blog.br/"><script type="module" src="/assets/app.js"></script></head><body><div id="root"></div></body></html>';
    fs.writeFileSync(path.join(dist, '_redirects'), '/articles/* /en/articles/:splat 301\n');
    const articles = [{ id: '12', slug: 'published-article' }];
    writeStaticRoutePages(template, dist, articles);
    const html = fs.readFileSync(path.join(dist, '404.html'), 'utf8');
    assert.match(html, /<h1[^>]*>Page not found<\/h1>/);
    assert.match(html, /href="\/"/);
    assert.match(html, /href="\/articles"/);
    assert.match(html, /name="robots" content="noindex, follow"/);
    assert.doesNotMatch(html, /rel="canonical"/);
    assert.doesNotMatch(html, /content="index, follow"/);
    assert.match(html, /src="\/assets\/app.js"/);

    for (const route of STATIC_ROUTE_PATHS) {
      const routeHtml = fs.readFileSync(path.join(dist, `${route.slice(1)}.html`), 'utf8');
      assert.ok(routeHtml.includes(`<title>${getPageSEO(route).title}</title>`));
      assert.ok(routeHtml.includes(`href="${getPageSEO(route).canonical}"`));
      if (route === '/admin' || route === '/research') assert.match(routeHtml, /noindex, follow/);
    }
    assert.equal(fs.existsSync(path.join(dist, 'missing.html')), false);
    const redirects = fs.readFileSync(path.join(dist, '_redirects'), 'utf8');
    assert.match(redirects, /\/articles\/\* \/en\/articles\/:splat 301/);
    for (const language of ['en', 'pt', 'es']) {
      assert.ok(redirects.includes(`/${language}/articles/12 /${language}/articles/published-article 301`));
    }
    writeStaticRoutePages(template, dist, articles);
    assert.equal(fs.readFileSync(path.join(dist, '_redirects'), 'utf8'), redirects);
  } finally {
    fs.rmSync(dist, { recursive: true, force: true });
  }
});
