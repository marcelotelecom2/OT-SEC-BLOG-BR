import { useParams, Link, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useBlog } from '../context/BlogContext';
import { ArrowLeft, Clock, Calendar, Eye, Tag } from 'lucide-react';
import { DecodeText } from '../components/ui/DecodeText';
import { ArticleContent } from '../components/article/ArticleContent';
import { ArticleSEO } from '../components/seo/ArticleSEO';

export function ArticleDetail() {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const identifier = slug || id || '';
  const { articles, updateArticle, recordPageView } = useBlog();

  // Procurar primeiro por article.slug, depois por article.id
  const article = articles.find(a => a.slug === identifier) || articles.find(a => a.id === identifier);

  // Backward compatibility: se acessado pelo ID antigo, redireciona para a URL com slug usando replace
  if (article && identifier === article.id && article.slug && identifier !== article.slug) {
    return <Navigate to={`/articles/${article.slug}`} replace />;
  }

  useEffect(() => {
    if (article) {
      recordPageView(`/articles/${article.slug}`);
      // Increment views count once
      updateArticle(article.id, { views: (article.views || 0) + 1 });
    }
  }, [article?.id]);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center font-mono">
        <title>Article Not Found | OT-SEC</title>
        <h2 className="text-xl text-rose-400 mb-4">[404] ARTICLE_NOT_FOUND</h2>
        <p className="text-gray-500 mb-8">The requested publication identifier does not exist in the index.</p>
        <Link to="/articles" className="px-4 py-2 bg-cyan-500 text-black font-bold text-xs uppercase rounded">
          Return to Articles
        </Link>
      </div>
    );
  }

  return (
    <article className="w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20">
      <ArticleSEO article={article} />
      {/* Navigation & Header: Max-width ~1100px */}
      <div className="max-w-[1100px] mx-auto">
        <Link
          to="/articles"
          className="inline-flex items-center text-xs font-mono text-cyan-400 hover:text-cyan-300 mb-6 sm:mb-8 transition-colors min-h-[44px] py-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2 shrink-0" /> Back to Articles Index
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
              <Eye className="w-3.5 h-3.5 shrink-0" /> {(article.views ?? 0)} views
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

        {/* Hero Cover Image */}
        {article.coverImage && (
          <div className="mb-10 sm:mb-14 rounded-lg overflow-hidden border border-gray-800/80 shadow-2xl">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-auto max-h-[520px] object-cover"
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
