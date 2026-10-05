import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { DecodeText } from '../components/ui/DecodeText';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { TerminalLoader } from '../components/ui/TerminalLoader';
import { useBlog } from '../context/BlogContext';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export function Articles() {
  const { articles, recordPageView } = useBlog();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    recordPageView('/articles');
  }, []);

  const publishedArticles = articles.filter(a => a.published !== false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 min-h-[80vh]">
      <div className="border-b border-gray-800 pb-6 sm:pb-8 mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3 sm:mb-4 cursor-crosshair">
          <DecodeText text="Articles" delay={100} />
        </h1>
        <p className="text-gray-400 font-mono text-xs sm:text-sm">Long-form publications and technical deep dives.</p>
      </div>
      
      {!isLoaded ? (
        <TerminalLoader onComplete={() => setIsLoaded(true)} text="FETCHING ARTICLE INDEX..." />
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6 sm:space-y-8"
        >
          {publishedArticles.length === 0 ? (
            <div className="text-gray-500 font-mono text-center py-12 border border-dashed border-gray-800 rounded">
              No published articles found. Log into Admin Panel to create new articles.
            </div>
          ) : (
            publishedArticles.map((article) => (
              <motion.div key={article.id} variants={itemVariants}>
                <SpotlightCard className="group relative flex flex-col md:flex-row items-start justify-between bg-transparent border border-gray-800/50 p-5 sm:p-6 md:p-8 transition-all duration-300 hud-border gap-5 sm:gap-6">
                  <div className="flex-1 z-10 relative">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-gray-500 mb-3">
                      <time dateTime={article.date}>{article.date}</time>
                      <span className="text-cyan-500/50">•</span>
                      <span>{article.readTime}</span>
                      {article.views !== undefined && article.views > 0 && (
                        <>
                          <span className="text-cyan-500/50">•</span>
                          <span className="text-cyan-400">{article.views} views</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold leading-snug text-gray-100 group-hover:text-cyan-400 transition-colors mb-3">
                      <Link to={`/articles/${article.slug}`}>
                        <span className="absolute inset-0" />
                        {article.title}
                      </Link>
                    </h3>
                    <p className="line-clamp-3 text-xs sm:text-sm leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors">
                      {article.summary}
                    </p>
                  </div>
                  <div className="relative md:mt-0 flex items-center z-10 shrink-0">
                    <div className="text-xs font-mono px-2.5 py-1 rounded bg-gray-900 border border-gray-800 text-cyan-500/70 group-hover:border-cyan-900/50 transition-colors">
                      {article.area}
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}
