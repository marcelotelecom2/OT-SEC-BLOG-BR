import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { NotFoundContent, NOT_FOUND_MESSAGES } from '../components/ui/NotFoundContent';
import { applyDefaultSEO, setCanonicalTag, setMetaTag } from '../lib/seo';

export function NotFound() {
  const { language } = useLanguage();

  useEffect(() => {
    applyDefaultSEO();
    document.title = `404 — ${NOT_FOUND_MESSAGES[language].title} | OT-SEC`;
    setMetaTag('name', 'robots', 'noindex, follow');
    setCanonicalTag(null);
    return () => {
      applyDefaultSEO();
      setMetaTag('name', 'robots', 'index, follow');
    };
  }, [language]);

  return <NotFoundContent language={language} />;
}
