import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getPageSEO } from '../src/lib/seo';
import { NotFoundContent } from '../src/components/ui/NotFoundContent';

// Cloudflare Pages stops applying its SPA fallback when a root 404.html exists.
// These files preserve direct requests to the application's valid static routes.
export const STATIC_ROUTE_PATHS = ['/articles', '/insights', '/projects', '/about', '/admin', '/research'];

export function writeStaticRoutePages(
  templateHtml: string,
  distDir: string,
  publishedArticles: ReadonlyArray<{ id: string; slug: string }> = [],
): void {
  for (const route of STATIC_ROUTE_PATHS) {
    const page = getPageSEO(route);
    let html = templateHtml
      .replace(/<title>[\s\S]*?<\/title>/i, `<title>${page.title}</title>`)
      .replace(/(<link\s+[^>]*rel=["']canonical["'][^>]*href=["'])[^"']+/, `$1${page.canonical}`)
      .replace(/(<meta\s+[^>]*property=["']og:url["'][^>]*content=["'])[^"']+/, `$1${page.canonical}`)
      .replace(/(<meta\s+[^>]*(?:property=["']og:title["']|name=["']twitter:title["'])[^>]*content=["'])[^"']+/g, `$1${page.title}`);
    if (route === '/admin' || route === '/research') {
      html = html.replace(/<meta\s+[^>]*name=["']robots["'][^>]*>/gi, '')
        .replace('</head>', '<meta name="robots" content="noindex, follow" /></head>');
    }
    fs.writeFileSync(path.join(distDir, `${route.slice(1)}.html`), html, 'utf8');
  }

  const root = '<div id="root"></div>';
  if (!templateHtml.includes(root)) throw new Error('Application root missing from the 404 template.');
  const body = renderToStaticMarkup(<NotFoundContent language="en" />);
  const html = templateHtml
    .replace(/<title>[\s\S]*?<\/title>/i, '<title>404 — Page not found | OT-SEC</title>')
    .replace(/<meta\s+[^>]*name=["']robots["'][^>]*>/gi, '')
    .replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>/gi, '')
    .replace('</head>', '<meta name="robots" content="noindex, follow" /></head>')
    .replace(root, `<div id="root"><main>${body}</main></div>`);
  fs.writeFileSync(path.join(distDir, '404.html'), html, 'utf8');

  // Legacy IDs still identify real articles and must redirect before the 404 fallback.
  const redirectsPath = path.join(distDir, '_redirects');
  const marker = '# Generated published article ID redirects';
  const existing = fs.existsSync(redirectsPath) ? fs.readFileSync(redirectsPath, 'utf8') : '';
  const redirects = publishedArticles.flatMap(article => article.id === article.slug ? []
    : ['en', 'pt', 'es'].map(language =>
      `/${language}/articles/${encodeURIComponent(article.id)} /${language}/articles/${article.slug} 301`));
  fs.writeFileSync(redirectsPath,
    `${existing.split(marker)[0].trimEnd()}\n${marker}\n${redirects.join('\n')}\n`, 'utf8');
}
