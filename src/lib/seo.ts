import { Article } from '../types';

export const SITE_URL = 'https://ot-sec.blog.br';

export const DEFAULT_SEO = {
  title: 'OT-SEC Digital Research Lab',
  description:
    'Independent research on Industrial Cybersecurity, Power Grid Security, Artificial Intelligence and Critical Infrastructure.',
  canonical: 'https://ot-sec.blog.br/',
  ogType: 'website',
  ogTitle: 'OT-SEC Digital Research Lab',
  ogDescription:
    'Independent research on Industrial Cybersecurity, Power Grid Security, Artificial Intelligence and Critical Infrastructure.',
  ogUrl: 'https://ot-sec.blog.br/',
  siteName: 'OT-SEC Digital Research Lab',
  twitterCard: 'summary_large_image',
  twitterTitle: 'OT-SEC Digital Research Lab',
  twitterDescription:
    'Independent research on Industrial Cybersecurity, Power Grid Security, Artificial Intelligence and Critical Infrastructure.',
};

/**
 * Truncates an article summary safely to ~150-160 characters without cutting words inappropriately.
 */
export function formatMetaDescription(text: string, maxLength = 160): string {
  if (!text) return '';
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  // Reserve 3 characters for ellipsis
  const target = maxLength - 3;
  const sliced = cleaned.slice(0, target);
  const lastSpace = sliced.lastIndexOf(' ');

  let result = lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced;
  // Clean up any trailing punctuation before adding ellipsis
  result = result.replace(/[,;:\-\s]+$/, '');
  return `${result}...`;
}

/**
 * Resolves an image URL to an absolute URL using https://ot-sec.blog.br.
 * Returns null if no image is provided.
 */
export function resolveImageUrl(image?: string): string | null {
  if (!image) return null;
  const trimmed = image.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${SITE_URL}${normalized}`;
}

/**
 * Returns canonical URL for an article using its slug.
 */
export function getArticleCanonicalUrl(slug: string): string {
  const cleanSlug = encodeURIComponent(slug.trim()).replace(/%2F/g, '/');
  return `${SITE_URL}/articles/${cleanSlug}`;
}

/**
 * Sets or removes a meta tag in document.head without leaving duplicate tags.
 */
export function setMetaTag(
  attributeName: 'name' | 'property',
  attributeValue: string,
  content: string | null
): void {
  if (typeof document === 'undefined') return;

  const elements = document.head.querySelectorAll(
    `meta[${attributeName}="${attributeValue}"]`
  );

  if (content === null || content === undefined || content === '') {
    // Remove if content is null or empty
    elements.forEach((el) => el.remove());
    return;
  }

  if (elements.length > 0) {
    // Update existing element
    elements[0].setAttribute('content', content);
    // Remove any accidental duplicates
    for (let i = 1; i < elements.length; i++) {
      elements[i].remove();
    }
  } else {
    // Create new meta element
    const meta = document.createElement('meta');
    meta.setAttribute(attributeName, attributeValue);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  }
}

/**
 * Sets or removes a canonical link tag in document.head without leaving duplicates.
 */
export function setCanonicalTag(href: string | null): void {
  if (typeof document === 'undefined') return;

  const elements = document.head.querySelectorAll('link[rel="canonical"]');

  if (!href) {
    elements.forEach((el) => el.remove());
    return;
  }

  if (elements.length > 0) {
    elements[0].setAttribute('href', href);
    for (let i = 1; i < elements.length; i++) {
      elements[i].remove();
    }
  } else {
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', href);
    document.head.appendChild(link);
  }
}

/**
 * Builds Schema.org Article structured data (JSON-LD) for an article.
 */
export function buildArticleStructuredData(article: Article): Record<string, unknown> {
  const canonicalUrl = getArticleCanonicalUrl(article.slug);
  const imageUrl = resolveImageUrl(article.coverImage);

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary,
    datePublished: article.date,
    dateModified: article.updatedAt && article.updatedAt.trim() ? article.updatedAt.trim() : article.date,
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    publisher: {
      '@type': 'Organization',
      name: 'OT-SEC',
    },
  };

  if (article.author && article.author.trim()) {
    schema.author = {
      '@type': 'Person',
      name: article.author.trim(),
    };
  }

  if (imageUrl) {
    schema.image = [imageUrl];
  }

  if (Array.isArray(article.tags) && article.tags.length > 0) {
    const validTags = article.tags
      .map((t) => (typeof t === 'string' ? t.trim() : ''))
      .filter((t) => t.length > 0);
    if (validTags.length > 0) {
      schema.keywords = validTags.join(', ');
    }
  }

  return schema;
}

/**
 * Injects or updates the JSON-LD script for an article in document.head.
 */
export function setArticleStructuredData(article: Article): void {
  if (typeof document === 'undefined') return;

  const schema = buildArticleStructuredData(article);
  const jsonString = JSON.stringify(schema, null, 2);

  let script = document.head.querySelector<HTMLScriptElement>('script#article-jsonld');
  if (script) {
    script.textContent = jsonString;
  } else {
    // Remove any untagged existing structured data scripts
    const existing = document.head.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]');
    existing.forEach((el) => el.remove());

    script = document.createElement('script');
    script.id = 'article-jsonld';
    script.type = 'application/ld+json';
    script.textContent = jsonString;
    document.head.appendChild(script);
  }
}

/**
 * Removes any Article structured data script from document.head.
 */
export function removeArticleStructuredData(): void {
  if (typeof document === 'undefined') return;
  const scripts = document.head.querySelectorAll<HTMLScriptElement>(
    'script#article-jsonld, script[type="application/ld+json"]'
  );
  scripts.forEach((el) => el.remove());
}

/**
 * Applies dynamic SEO metadata for an article.
 */
export function applyArticleSEO(article: Article): void {
  if (typeof document === 'undefined') return;

  const articleTitle = `${article.title} | OT-SEC`;
  const description = formatMetaDescription(article.summary);
  const canonical = getArticleCanonicalUrl(article.slug);
  const imageUrl = resolveImageUrl(article.coverImage);

  // Document title
  document.title = articleTitle;

  // Standard metadata
  setMetaTag('name', 'description', description);
  setCanonicalTag(canonical);

  // Open Graph
  setMetaTag('property', 'og:type', 'article');
  setMetaTag('property', 'og:title', article.title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:url', canonical);
  setMetaTag('property', 'og:site_name', DEFAULT_SEO.siteName);
  setMetaTag('property', 'og:image', imageUrl);

  // Twitter
  setMetaTag('name', 'twitter:card', DEFAULT_SEO.twitterCard);
  setMetaTag('name', 'twitter:title', article.title);
  setMetaTag('name', 'twitter:description', description);
  setMetaTag('name', 'twitter:image', imageUrl);

  // Structured Data (JSON-LD)
  setArticleStructuredData(article);
}

/**
 * Restores the default institutional metadata for the homepage and other pages.
 */
export function applyDefaultSEO(): void {
  if (typeof document === 'undefined') return;

  document.title = DEFAULT_SEO.title;

  // Standard metadata
  setMetaTag('name', 'description', DEFAULT_SEO.description);
  setCanonicalTag(DEFAULT_SEO.canonical);

  // Open Graph
  setMetaTag('property', 'og:type', DEFAULT_SEO.ogType);
  setMetaTag('property', 'og:title', DEFAULT_SEO.ogTitle);
  setMetaTag('property', 'og:description', DEFAULT_SEO.ogDescription);
  setMetaTag('property', 'og:url', DEFAULT_SEO.ogUrl);
  setMetaTag('property', 'og:site_name', DEFAULT_SEO.siteName);
  // Remove og:image if it exists
  setMetaTag('property', 'og:image', null);

  // Twitter
  setMetaTag('name', 'twitter:card', DEFAULT_SEO.twitterCard);
  setMetaTag('name', 'twitter:title', DEFAULT_SEO.twitterTitle);
  setMetaTag('name', 'twitter:description', DEFAULT_SEO.twitterDescription);
  // Remove twitter:image if it exists
  setMetaTag('name', 'twitter:image', null);

  // Remove Article Structured Data (JSON-LD)
  removeArticleStructuredData();
}
