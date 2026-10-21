import { useEffect } from 'react';
import type { ArticleLanguage } from '../../types';
import { applyDefaultSEO, setCanonicalTag, setMetaTag } from '../../lib/seo';

export function MissingArticleSEO({ title, language }: { title: string; language: ArticleLanguage }) {
  useEffect(() => {
    applyDefaultSEO(window.location.pathname, language);
    document.title = `${title} | OT-SEC`;
    // Keep robots under the same imperative owner as PageLayout. A React-hoisted
    // meta tag must not be removed by setMetaTag's duplicate cleanup.
    setMetaTag('name', 'robots', 'noindex, follow');
    setCanonicalTag(null);
    return () => applyDefaultSEO(window.location.pathname);
  }, [title, language]);

  return <title>{`${title} | OT-SEC`}</title>;
}
