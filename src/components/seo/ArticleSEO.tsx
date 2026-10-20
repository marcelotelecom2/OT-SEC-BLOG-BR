import { useEffect } from 'react';
import { Article, ArticleLanguage } from '../../types';
import { applyArticleSEO, applyDefaultSEO } from '../../lib/seo';

interface ArticleSEOProps {
  article: Article;
  language: ArticleLanguage;
}

/**
 * ArticleSEO manages dynamic SEO metadata for articles in OT-SEC.
 * Integrates native React 19 document metadata (<title>) and head synchronization.
 */
export function ArticleSEO({ article, language }: ArticleSEOProps) {
  useEffect(() => {
    applyArticleSEO(article, language);

    return () => {
      // Cleanup runs after the destination layout effect. Keep that route's
      // canonical instead of overwriting it with the homepage defaults.
      applyDefaultSEO(window.location.pathname);
    };
  }, [
    article.id,
    article.slug,
    article.title,
    article.summary,
    article.coverImage,
    article.date,
    article.updatedAt,
    article.author,
    article.tags,
    language,
  ]);

  return (
    <title>{`${article.title} | OT-SEC`}</title>
  );
}
