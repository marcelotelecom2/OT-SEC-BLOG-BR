import { useParams, Link, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useBlog } from '../context/BlogContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, Clock, Calendar, Eye, Tag } from 'lucide-react';
import { DecodeText } from '../components/ui/DecodeText';
import { ArticleContent } from '../components/article/ArticleContent';
import { ArticleSEO } from '../components/seo/ArticleSEO';
import { findPublicArticle } from '../lib/articleState';
import { localizeArticle } from '../lib/articleLocalization';
import type { ArticleLanguage } from '../types';
import { ResponsiveImage } from '../components/ui/ResponsiveImage';

const LANGUAGE_NAMES: Record<ArticleLanguage, Record<ArticleLanguage, string>> = {
  en: { en: 'English', pt: 'Portuguese', es: 'Spanish' },
  pt: { en: 'inglês', pt: 'português', es: 'espanhol' },
  es: { en: 'inglés', pt: 'portugués', es: 'español' },
};

export function ArticleDetail({ routeLanguage }: { routeLanguage?: ArticleLanguage } = {}) {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const identifier = slug || id || '';
  const { articles, updateArticle, recordPageView } = useBlog();
  const { language: selectedLanguage, setLanguage, t } = useLanguage();
  const language = routeLanguage ?? selectedLanguage;

  useEffect(() => {
    if (routeLanguage && routeLanguage !== selectedLanguage) setLanguage(routeLanguage);
  }, [routeLanguage, selectedLanguage, setLanguage]);

  // Procurar primeiro por article.slug, depois por article.id
  const rawArticle = findPublicArticle(articles, identifier);

  useEffect(() => {
    if (rawArticle && identifier === rawArticle.slug) {
      recordPageView(`/${language}/articles/${rawArticle.slug}`);
      // Increment views count once
      updateArticle(rawArticle.id, { views: (rawArticle.views || 0) + 1 });
    }
  }, [rawArticle?.id, identifier, language]);

  // Keep hooks unconditional when navigating between legacy IDs and public slugs.
  if (rawArticle && identifier === rawArticle.id && rawArticle.slug && identifier !== rawArticle.slug) {
    return <Navigate to={`/${language}/articles/${rawArticle.slug}`} replace />;
  }

  if (!rawArticle) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center font-mono">
        <title>Article Not Found | OT-SEC</title>
        <meta name="robots" content="noindex, follow" />
        <h2 className="text-xl text-rose-400 mb-4">{t.articleDetail.notFoundTitle}</h2>
        <p className="text-gray-500 mb-8">{t.articleDetail.notFoundDesc}</p>
        <Link to="/articles" className="px-4 py-2 bg-cyan-500 text-black font-bold text-xs uppercase rounded">
          {t.articleDetail.returnBtn}
        </Link>
      </div>
    );
  }

  const localization = localizeArticle(rawArticle, language);
  const article = localization.article;
  const showLanguageNotice = localization.contentLanguage !== language;
  const languageNotice = (localization.metadataTranslated
    ? t.articleDetail.metadataOnlyNotice
    : t.articleDetail.untranslatedNotice
  ).replace('{language}', LANGUAGE_NAMES[language][localization.contentLanguage]);

  return (
    <article className="w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20">
      <ArticleSEO article={article} language={language} />
      {/* Navigation & Header: Max-width ~1100px */}
      <div className="max-w-[1100px] mx-auto">
        <Link
          to="/articles"
          className="inline-flex items-center text-xs font-mono text-cyan-400 hover:text-cyan-300 mb-6 sm:mb-8 transition-colors min-h-[44px] py-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2 shrink-0" /> {t.articleDetail.backBtn}
        </Link>

        <header className="border-b border-gray-800 pb-8 sm:pb-10 mb-8 sm:mb-12">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-gray-500 mb-4">
            <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
              <Tag className="w-3.5 h-3.5 shrink-0" /> {article.area}
            </span>
            <span className="text-gray-700 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 shrink-0" /> {article.date}
            </span>
            <span className="text-gray-700 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 shrink-0" /> {article.readTime}
            </span>
            <span className="text-gray-700 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 text-cyan-300">
              <Eye className="w-3.5 h-3.5 shrink-0" /> {(article.views ?? 0)} {t.articleDetail.views}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-bold text-white tracking-tight leading-[1.15] mb-6 font-sans break-words">
            <DecodeText text={article.title} delay={100} />
          </h1>

          {/* Editorial Lead Paragraph */}
          <p className="text-lg sm:text-xl text-gray-300 font-sans leading-relaxed border-l-2 border-cyan-500 pl-5 py-2 bg-cyan-950/20 rounded-r">
            {article.summary}
          </p>
        </header>

        {showLanguageNotice && (
          <div role="status" className="mb-8 rounded border border-amber-700/60 bg-amber-950/30 px-4 py-3 text-sm text-amber-200 font-mono">
            {languageNotice}
          </div>
        )}

        {/* Hero Cover Image */}
        {article.coverImage && (
          <div className="mb-10 sm:mb-14 rounded-lg overflow-hidden border border-gray-800/80 shadow-2xl">
            <ResponsiveImage
              src={article.coverImage}
              alt={article.title}
              sizes="(max-width: 1150px) calc(100vw - 32px), 1100px"
              className="w-full h-auto max-h-[520px] object-cover"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </div>

      {/* Editorial Article Body: Max-width 780px, centered, on page background without card */}
      <div className="max-w-[780px] mx-auto">
        <ArticleContent content={article.content || article.summary} />
      </div>
    </article>
  );
}
