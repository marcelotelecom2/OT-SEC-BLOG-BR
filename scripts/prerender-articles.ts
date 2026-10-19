import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ARTICLES_METADATA } from '../src/content/articles/metadata';
import { Article, ArticleLanguage } from '../src/types';
import { ArticleContent } from '../src/components/article/ArticleContent';
import { localizeArticle } from '../src/lib/articleLocalization';
import {
  formatMetaDescription,
  resolveImageUrl,
  getArticleCanonicalUrl,
  getArticleLanguageUrls,
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

function loadArticleContent(articleMeta: (typeof ARTICLES_METADATA)[number]): Article {
  const contentRoot = path.resolve(projectRoot, 'src/content/articles');
  const readMarkdown = (filename: string) => {
    const resolved = path.resolve(contentRoot, filename);
    if (!resolved.startsWith(contentRoot + path.sep)) throw new Error(`Invalid content file: ${filename}`);
    return fs.readFileSync(resolved, 'utf8');
  };
  const translations: Article['translations'] = {};
  for (const [language, translation] of Object.entries(articleMeta.translations ?? {})) {
    if (!translation) continue;
    translations[language as keyof typeof translations] = {
      title: translation.title,
      summary: translation.summary,
      ...(translation.contentFile ? { content: readMarkdown(translation.contentFile) } : {}),
    };
  }
  const { contentFile, translations: _metadataTranslations, ...metadata } = articleMeta;
  return {
    ...metadata,
    content: readMarkdown(contentFile),
    ...(Object.keys(translations).length ? { translations } : {}),
  };
}

function renderArticleBody(article: Article): string {
  const body = renderToStaticMarkup(React.createElement(ArticleContent, {
    content: article.content || article.summary,
  })).replace(/\snode="\[object Object\]"/g, '');
  const cover = article.coverImage
    ? `<div class="mb-10 sm:mb-14 rounded-lg overflow-hidden border border-gray-800/80 shadow-2xl"><img src="${escapeHtml(article.coverImage)}" alt="${escapeHtml(article.title)}" class="w-full h-auto max-h-[520px] object-cover" /></div>`
    : '';
  return `<article data-prerendered-article="true" class="w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20">
  <div class="max-w-[1100px] mx-auto">
    <header class="border-b border-gray-800 pb-8 sm:pb-10 mb-8 sm:mb-12">
      <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-gray-500 mb-4">
        <span class="text-cyan-400 font-medium">${escapeHtml(article.area)}</span>
        <time datetime="${escapeHtml(article.date)}">${escapeHtml(article.date)}</time>
        <span>${escapeHtml(article.readTime)}</span>
      </div>
      <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-bold text-white tracking-tight leading-[1.15] mb-6 font-sans break-words">${escapeHtml(article.title)}</h1>
      <p class="text-lg sm:text-xl text-gray-300 font-sans leading-relaxed border-l-2 border-cyan-500 pl-5 py-2 bg-cyan-950/20 rounded-r">${escapeHtml(article.summary)}</p>
    </header>
    ${cover}
  </div>
  <div class="max-w-[780px] mx-auto">${body}</div>
</article>`;
}

/**
 * Transforms dist/index.html template into article-specific static HTML
 * containing individual title, description, canonical link, Open Graph,
 * Twitter card, and Schema.org Article structured data.
 */
export function prerenderArticleHtml(templateHtml: string, article: Article, language: ArticleLanguage): string {
  const canonicalUrl = getArticleCanonicalUrl(article.slug, language);
  const languageUrls = getArticleLanguageUrls(article.slug);
  const formattedDescription = formatMetaDescription(article.summary, 160);
  const imageUrl = resolveImageUrl(article.coverImage);
  const schema = buildArticleStructuredData(article, language);

  // 1. Remove generic head metadata tags from index.html template
  let cleanedHtml = templateHtml;

  // Remove existing <title>...</title>
  cleanedHtml = cleanedHtml.replace(/<title[\s\S]*?<\/title>/gi, '');

  // Remove existing <meta name="description" ...>
  cleanedHtml = cleanedHtml.replace(/<meta\s+[^>]*?name=["']description["'][^>]*?>/gis, '');

  // Remove existing <link rel="canonical" ...>
  cleanedHtml = cleanedHtml.replace(/<link\s+[^>]*?rel=["']canonical["'][^>]*?>/gis, '');
  cleanedHtml = cleanedHtml.replace(/<link\s+[^>]*?rel=["']alternate["'][^>]*?>/gis, '');
  cleanedHtml = cleanedHtml.replace(/<html\s+lang=["'][^"']+["']/i,
    `<html lang="${language === 'pt' ? 'pt-BR' : language}"`);

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
    <link rel="alternate" hreflang="en" href="${escapeHtml(languageUrls.en)}" />
    <link rel="alternate" hreflang="pt-BR" href="${escapeHtml(languageUrls.pt)}" />
    <link rel="alternate" hreflang="es" href="${escapeHtml(languageUrls.es)}" />
    <link rel="alternate" hreflang="x-default" href="${escapeHtml(languageUrls.en)}" />

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

  const compactedHtml = compactedLines.join('\n');
  const root = '<div id="root"></div>';
  if (!compactedHtml.includes(root)) throw new Error('The application root was not found in the build template.');
  return compactedHtml.replace(root, `<div id="root">${renderArticleBody(article)}</div>`);
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
  for (const article of publishedArticles) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) {
      throw new Error(`Invalid article slug: ${article.slug}`);
    }
  }
  const languages: ArticleLanguage[] = ['en', 'pt', 'es'];
  console.log(`[Prerender] Found ${publishedArticles.length} published articles in ${languages.length} languages.`);

  // Remove output from earlier builds before writing the current published set.
  fs.rmSync(path.resolve(distDir, 'articles'), { recursive: true, force: true });
  for (const language of languages) {
    fs.rmSync(path.resolve(distDir, language, 'articles'), { recursive: true, force: true });
    fs.mkdirSync(path.resolve(distDir, language, 'articles'), { recursive: true });
  }

  let count = 0;
  for (const articleMeta of publishedArticles) {
    const sourceArticle = loadArticleContent(articleMeta);
    for (const language of languages) {
      const localization = localizeArticle(sourceArticle, language);
      if (!localization.bodyTranslated) throw new Error(`Missing ${language.toUpperCase()} body: ${sourceArticle.slug}`);
      const article = localization.article;
      const articleHtml = prerenderArticleHtml(templateHtml, article, language);
      if (!articleHtml.includes('data-prerendered-article="true"')
        || !articleHtml.includes('article-editorial-content')) {
        throw new Error(`Article body was not prerendered: ${language}/${article.slug}`);
      }
      const outputFilePath = path.resolve(distDir, language, 'articles', `${article.slug}.html`);
      fs.writeFileSync(outputFilePath, articleHtml, 'utf-8');
      count++;
      console.log(`[Prerender] Generated: /${language}/articles/${article.slug}`);
    }
  }

  console.log(`[Prerender] Successfully generated ${count} localized article pages.`);
}

main();
