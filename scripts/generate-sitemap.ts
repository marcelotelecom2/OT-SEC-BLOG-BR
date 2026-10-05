import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ARTICLES_METADATA } from '../src/content/articles/metadata';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const BASE_URL = 'https://ot-sec.blog.br';

/**
 * Public routes derived directly from src/App.tsx route definitions:
 * - "/" (Home page)
 * - "/articles" (Articles archive/list)
 * - "/insights" (Research / Insights page; note: /research redirects to /insights)
 * - "/projects" (Research projects)
 * - "/about" (About OT-SEC Lab)
 *
 * Excluded:
 * - "/admin" (Private administration area)
 * - "/research" (Redirect to /insights, not a canonical content URL)
 */
const PUBLIC_STATIC_ROUTES = [
  '/',
  '/articles',
  '/insights',
  '/projects',
  '/about',
];

interface SitemapUrlEntry {
  loc: string;
  lastmod?: string;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatLastmod(dateStr?: string): string | undefined {
  if (!dateStr || typeof dateStr !== 'string') return undefined;
  const trimmed = dateStr.trim();
  const match = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
  if (match) {
    return match[1];
  }
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }
  return undefined;
}

export function generateSitemapXml(): { xml: string; entries: SitemapUrlEntry[] } {
  const seenUrls = new Set<string>();
  const entries: SitemapUrlEntry[] = [];

  // 1. Add real public static routes
  for (const route of PUBLIC_STATIC_ROUTES) {
    const loc = route === '/' ? `${BASE_URL}/` : `${BASE_URL}${route}`;
    if (!seenUrls.has(loc)) {
      seenUrls.add(loc);
      entries.push({ loc });
    }
  }

  // 2. Add published articles using semantic slugs only
  const publishedArticles = ARTICLES_METADATA.filter((article) => article.published === true);

  for (const article of publishedArticles) {
    const loc = `${BASE_URL}/articles/${encodeURIComponent(article.slug)}`;
    if (!seenUrls.has(loc)) {
      seenUrls.add(loc);
      const rawDate = article.updatedAt || article.date;
      const lastmod = formatLastmod(rawDate);
      entries.push({ loc, lastmod });
    }
  }

  // 3. Assemble valid XML compliant with sitemap 0.9 protocol
  const xmlLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  for (const entry of entries) {
    xmlLines.push('  <url>');
    xmlLines.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
    if (entry.lastmod) {
      xmlLines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
    }
    xmlLines.push('  </url>');
  }

  xmlLines.push('</urlset>');
  xmlLines.push(''); // trailing newline

  return { xml: xmlLines.join('\n'), entries };
}

function main() {
  const { xml, entries } = generateSitemapXml();

  const publicDir = path.resolve(projectRoot, 'public');
  const distDir = path.resolve(projectRoot, 'dist');

  // Always write to public/sitemap.xml (so Vite serves it in dev and bundles it into dist during build)
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const publicSitemapPath = path.resolve(publicDir, 'sitemap.xml');
  fs.writeFileSync(publicSitemapPath, xml, 'utf-8');
  console.log(`[Sitemap] Generated public/sitemap.xml with ${entries.length} URLs`);

  // If dist/ directory already exists (e.g. if invoked post-build or re-run), update dist/sitemap.xml as well
  if (fs.existsSync(distDir)) {
    const distSitemapPath = path.resolve(distDir, 'sitemap.xml');
    fs.writeFileSync(distSitemapPath, xml, 'utf-8');
    console.log(`[Sitemap] Synced to dist/sitemap.xml`);
  }
}

main();
