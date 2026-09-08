import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useBlog } from '../context/BlogContext';
import { ArrowLeft, Clock, Calendar, Eye, Tag } from 'lucide-react';
import { DecodeText } from '../components/ui/DecodeText';
import { SpotlightCard } from '../components/ui/SpotlightCard';

export function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const { articles, updateArticle, recordPageView } = useBlog();

  const article = articles.find(a => a.id === id);

  useEffect(() => {
    if (article) {
      recordPageView(`/articles/${article.id}`);
      // Increment views count once
      updateArticle(article.id, { views: (article.views || 0) + 1 });
    }
  }, [id]);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center font-mono">
        <h2 className="text-xl text-rose-400 mb-4">[404] ARTICLE_NOT_FOUND</h2>
        <p className="text-gray-500 mb-8">The requested publication identifier does not exist in the index.</p>
        <Link to="/articles" className="px-4 py-2 bg-cyan-500 text-black font-bold text-xs uppercase rounded">
          Return to Articles
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20">
      <Link to="/articles" className="inline-flex items-center text-xs font-mono text-cyan-400 hover:text-cyan-300 mb-6 sm:mb-8 transition-colors min-h-[44px] py-1">
        <ArrowLeft className="w-4 h-4 mr-2 shrink-0" /> Back to Articles Index
      </Link>

      <header className="border-b border-gray-800 pb-6 sm:pb-8 mb-8 sm:mb-10">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-gray-500 mb-4">
          <span className="flex items-center gap-1.5 text-cyan-400">
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
            <Eye className="w-3.5 h-3.5 shrink-0" /> {(article.views || 1)} views
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-6 font-sans break-words">
          <DecodeText text={article.title} delay={100} />
        </h1>

        <p className="text-base sm:text-lg text-gray-300 font-sans leading-relaxed border-l-2 border-cyan-500 pl-4 py-1.5 bg-cyan-950/20 rounded-r">
          {article.summary}
        </p>
      </header>

      {article.coverImage && (
        <div className="mb-8 sm:mb-10 rounded overflow-hidden border border-gray-800">
          <img src={article.coverImage} alt={article.title} className="w-full h-auto max-h-[400px] object-cover" referrerPolicy="no-referrer" />
        </div>
      )}

      <SpotlightCard className="p-5 sm:p-6 md:p-8 border border-gray-800/80 bg-gray-950/30 overflow-hidden">
        <div className="prose prose-invert prose-cyan max-w-none font-sans text-gray-300 leading-relaxed whitespace-pre-line break-words text-sm sm:text-base">
          {article.content || article.summary}
        </div>
      </SpotlightCard>
    </article>
  );
}
