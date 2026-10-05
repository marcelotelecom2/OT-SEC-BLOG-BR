import { useEffect } from 'react';
import { Article } from '../../types';
import { applyArticleSEO, applyDefaultSEO } from '../../lib/seo';

interface ArticleSEOProps {
  article: Article;
}

/**
 * ArticleSEO manages dynamic SEO metadata for articles in OT-SEC.
 * Integrates native React 19 document metadata (<title>) and head synchronization.
 */
export function ArticleSEO({ article }: ArticleSEOProps) {
  useEffect(() => {
    applyArticleSEO(article);

    return () => {
      applyDefaultSEO();
    };
  }, [article.id, article.slug, article.title, article.summary, article.coverImage]);

  return (
    <title>{`${article.title} | OT-SEC`}</title>
  );
}
