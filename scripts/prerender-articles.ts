import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ARTICLES_METADATA } from '../src/content/articles/metadata';
import { Article } from '../src/types';
import {
  formatMetaDescription,
  resolveImageUrl,
  getArticleCanonicalUrl,
  buildArticleStructuredData,
} from '../src/lib/seo';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');
const templateHtmlPath = path.resolve(distDir, 'index.html');

/**
 * Escapes characters for HTML attributes and content.
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Transforms dist/index.html template into article-specific static HTML
 * containing individual title, description, canonical link, Open Graph,
 * Twitter card, and Schema.org Article structured data.
 */
export function prerenderArticleHtml(templateHtml: string, article: Article): string {
  const canonicalUrl = getArticleCanonicalUrl(article.slug);
  const formattedDescription = formatMetaDescription(article.summary, 160);
  const imageUrl = resolveImageUrl(article.coverImage);
  const schema = buildArticleStructuredData(article);

  // 1. Remove generic head metadata tags from index.html template
  let cleanedHtml = templateHtml;

  // Remove existing <title>...</title>
  cleanedHtml = cleanedHtml.replace(/<title[\s\S]*?<\/title>/gi, '');

  // Remove existing <meta name="description" ...>
  cleanedHtml = cleanedHtml.replace(/<meta\s+[^>]*?name=["']description["'][^>]*?>/gis, '');

  // Remove existing <link rel="canonical" ...>
  cleanedHtml = cleanedHtml.replace(/<link\s+[^>]*?rel=["']canonical["'][^>]*?>/gis, '');

  // Remove existing og:* meta tags
  cleanedHtml = cleanedHtml.replace(/<meta\s+[^>]*?(?:property|name)=["']og:[^"']+["'][^>]*?>/gis, '');

  // Remove existing twitter:* meta tags
  cleanedHtml = cleanedHtml.replace(/<meta\s+[^>]*?(?:property|name)=["']twitter:[^"']+["'][^>]*?>/gis, '');

  // Remove existing JSON-LD scripts
  cleanedHtml = cleanedHtml.replace(/<script\s+[^>]*?type=["']application\/ld\+json["'][\s\S]*?<\/script>/gis, '');

  // Remove generic template comment banners
  cleanedHtml = cleanedHtml.replace(/<!--\s*Meta Description\s*-->/gi, '');
  cleanedHtml = cleanedHtml.replace(/<!--\s*Canonical URL\s*-->/gi, '');
  cleanedHtml = cleanedHtml.replace(/<!--\s*Open Graph[^-]*-->/gi, '');
  cleanedHtml = cleanedHtml.replace(/<!--\s*Twitter[^-]*-->/gi, '');

  // Clean excessive blank lines in <head>
  cleanedHtml = cleanedHtml.replace(/(<head[^>]*>)(?:\s*\n)+/i, '$1\n');

  // 2. Build article-specific metadata tags
  const ogImageTag = imageUrl ? `\n    <meta property="og:image" content="${escapeHtml(imageUrl)}" />` : '';
  const twitterImageTag = imageUrl ? `\n    <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />` : '';

  // Safe JSON-LD script content
  const jsonLdContent = JSON.stringify(schema, null, 2).replace(/<\/script/gi, '<\\/script');

  const articleHeadTags = `
    <!-- Article SEO Metadata -->
    <title>${escapeHtml(`${article.title} | OT-SEC`)}</title>
    <meta name="description" content="${escapeHtml(formattedDescription)}" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />

    <!-- Open Graph -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    <meta property="og:title" content="${escapeHtml(article.title)}" />
    <meta property="og:description" content="${escapeHtml(formattedDescription)}" />
    <meta property="og:site_name" content="OT-SEC Digital Research Lab" />${ogImageTag}

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(article.title)}" />
    <meta name="twitter:description" content="${escapeHtml(formattedDescription)}" />${twitterImageTag}

    <!-- Article Structured Data (JSON-LD) -->
    <script type="application/ld+json">
${jsonLdContent}
    </script>
`;

  // 3. Inject article tags right after favicon tag if present, or before </head>
  let finalHtml = '';
  const faviconMatch = cleanedHtml.match(/(<link\s+[^>]*?rel=["'](?:shortcut\s+)?icon["'][^>]*?>)/i);
  if (faviconMatch && faviconMatch.index !== undefined) {
    const insertPos = faviconMatch.index + faviconMatch[0].length;
    finalHtml = cleanedHtml.slice(0, insertPos) + '\n' + articleHeadTags + cleanedHtml.slice(insertPos);
  } else {
    finalHtml = cleanedHtml.replace('</head>', `${articleHeadTags}\n  </head>`);
  }

  // Remove lines that are only whitespace while collapsing multiple empty lines
  const lines = finalHtml.split('\n');
  const compactedLines: string[] = [];
  let prevWasEmpty = false;

  for (const line of lines) {
    const isLineEmpty = line.trim().length === 0;
    if (isLineEmpty) {
      if (!prevWasEmpty) {
        compactedLines.push('');
        prevWasEmpty = true;
      }
    } else {
      compactedLines.push(line);
      prevWasEmpty = false;
    }
  }

  return compactedLines.join('\n');
}

/**
 * Main execution function
 */
export function main() {
  if (!fs.existsSync(templateHtmlPath)) {
    console.error(`[Prerender] Error: dist/index.html not found at ${templateHtmlPath}. Run vite build first.`);
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(templateHtmlPath, 'utf-8');

  // Filter only published articles
  const publishedArticles = ARTICLES_METADATA.filter((article) => article.published === true);

  console.log(`[Prerender] Found ${publishedArticles.length} published articles to prerender.`);

  let count = 0;
  for (const articleMeta of publishedArticles) {
    const article: Article = {
      ...articleMeta,
    };

    const articleHtml = prerenderArticleHtml(templateHtml, article);
    const articleDir = path.resolve(distDir, 'articles', article.slug);

    if (!fs.existsSync(articleDir)) {
      fs.mkdirSync(articleDir, { recursive: true });
    }

    const outputFilePath = path.resolve(articleDir, 'index.html');
    fs.writeFileSync(outputFilePath, articleHtml, 'utf-8');
    count++;
    console.log(`[Prerender] Generated static HTML for: /articles/${article.slug} (${outputFilePath})`);
  }

  console.log(`[Prerender] Successfully generated ${count} article static HTML pages.`);
}

main();
