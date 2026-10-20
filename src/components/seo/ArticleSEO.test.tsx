import assert from 'node:assert/strict';
import test from 'node:test';
import React, { act, useLayoutEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import { ArticleSEO } from './ArticleSEO';
import { applyDefaultSEO, getArticleCanonicalUrl, SITE_URL } from '../../lib/seo';
import type { Article } from '../../types';

test('article cleanup preserves destination metadata, including /insights', async () => {
  const dom = new JSDOM('<!doctype html><html><head></head><body><div id="root"></div></body></html>', {
    url: `${SITE_URL}/en/articles/first-article`,
  });
  const globals = { window: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true };
  const previous = new Map(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) {
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }
  const root = createRoot(document.getElementById('root')!);
  const article: Article = {
    id: 'first', slug: 'first-article', title: 'First article', summary: 'Summary', content: 'Body',
    date: '2026-10-20', readTime: '1 min', area: 'Technical Standards', published: true,
  };

  // A destination layout effect runs before the old article's passive cleanup,
  // matching PageLayout's ordering during a client-side route transition.
  function Destination({ pathname }: { pathname: string }) {
    useLayoutEffect(() => applyDefaultSEO(pathname), [pathname]);
    return <main>{pathname}</main>;
  }
  function assertMetadata(expected: string) {
    const canonicals = document.head.querySelectorAll('link[rel="canonical"]');
    const ogUrls = document.head.querySelectorAll('meta[property="og:url"]');
    assert.equal(canonicals.length, 1);
    assert.equal(ogUrls.length, 1);
    assert.equal(canonicals[0].getAttribute('href'), expected);
    assert.equal(ogUrls[0].getAttribute('content'), expected);
  }

  try {
    for (const pathname of ['/insights', '/', '/articles', '/projects', '/about']) {
      dom.window.history.replaceState(null, '', '/en/articles/first-article');
      await act(async () => root.render(<ArticleSEO article={article} language="en" />));
      assertMetadata(getArticleCanonicalUrl(article.slug, 'en'));
      dom.window.history.pushState(null, '', pathname);
      await act(async () => root.render(<Destination pathname={pathname} />));
      assertMetadata(`${SITE_URL}${pathname}`);
      assert.equal(document.head.querySelectorAll('#article-jsonld, link[hreflang]').length, 0);
    }

    for (const [slug, language] of [['first-article', 'en'], ['second-article', 'pt']] as const) {
      dom.window.history.pushState(null, '', `/${language}/articles/${slug}`);
      await act(async () => root.render(<ArticleSEO article={{ ...article, id: slug, slug }} language={language} />));
      assertMetadata(getArticleCanonicalUrl(slug, language));
      assert.equal(document.head.querySelectorAll('#article-jsonld').length, 1);
      assert.equal(document.head.querySelectorAll('link[hreflang]').length, 4);
    }
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});
