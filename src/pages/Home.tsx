import { useEffect } from 'react';
import { ArrowRight, Shield, Cpu, Network } from 'lucide-react';
import { CyberHero } from '../components/ui/CyberHero';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { DecodeText } from '../components/ui/DecodeText';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { useBlog } from '../context/BlogContext';
import { useLanguage, getLocalizedArticle } from '../context/LanguageContext';
import { getTagBadgeStyle, getAuthorBadgeStyle } from '../constants/researchClassification';
import { publicNotes } from '../lib/articleState';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export function Home() {
  const { articles, notes, recordPageView } = useBlog();
  const { language, t } = useLanguage();

  useEffect(() => {
    recordPageView('/');
  }, []);

  const latestArticles = articles
    .filter(a => a.published !== false)
    .slice(0, 3)
    .map(a => getLocalizedArticle(a, language));

  const latestNotes = publicNotes(notes).slice(0, 3);

  const researchAreas = [
    { id: '1', title: t.home.area1Title, icon: Shield, desc: t.home.area1Desc },
    { id: '2', title: t.home.area2Title, icon: Cpu, desc: t.home.area2Desc },
    { id: '3', title: t.home.area3Title, icon: Network, desc: t.home.area3Desc },
  ];

  return (
    <div className="flex flex-col w-full relative">
      {/* Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[640px] py-16 sm:py-20 flex items-center justify-center overflow-hidden border-b border-gray-800">
        <CyberHero />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-3 py-1 mb-6 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm cursor-crosshair group"
          >
            <span className="flex w-2 h-2 rounded-full bg-cyan-400 mr-2 group-hover:animate-ping transition-all duration-300"></span>
            <DecodeText text={t.hero.badge} className="text-xs font-mono text-cyan-300 tracking-wider" delay={500} />
          </motion.div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-bold tracking-tight text-white mb-6">
            <DecodeText text={t.hero.title1} delay={800} /> <br />
            <motion.span 
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500 inline-block"
            >
              {t.hero.title2}
            </motion.span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.5 }}
            className="max-w-2xl text-base sm:text-lg md:text-xl text-gray-400 font-sans mb-8 sm:mb-10 leading-relaxed"
          >
            {t.hero.subtitle}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.1, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center"
          >
            <Link to="/insights" className="hud-border relative overflow-hidden px-6 sm:px-8 py-3.5 text-white font-mono text-sm tracking-widest uppercase bg-transparent group min-h-[44px] flex items-center justify-center">
              <span className="absolute inset-0 bg-cyan-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
              <span className="relative z-10 flex items-center justify-center">
                {t.hero.btnInsights}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link to="/articles" className="px-6 sm:px-8 py-3.5 text-gray-300 font-mono text-sm tracking-widest uppercase hover:text-white transition-colors flex items-center justify-center border border-gray-800 hover:border-gray-600 bg-gray-900/50 min-h-[44px]">
              {t.hero.btnArticles}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 w-full">
        
        {/* Latest Research */}
        <motion.section 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mb-14 sm:mb-20 md:mb-24"
        >
          <motion.div variants={itemVariants} className="flex items-end justify-between mb-8 sm:mb-12 border-b border-gray-800 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans mb-1.5 cursor-crosshair">
                <DecodeText text={t.home.latestTitle} delay={0} />
              </h2>
              <p className="text-gray-500 font-mono text-xs sm:text-sm">{t.home.latestSubtitle}</p>
            </div>
            <Link to="/articles" className="inline-flex items-center text-cyan-400 font-mono text-xs sm:text-sm hover:text-cyan-300 transition-colors py-1">
              {t.home.viewAll} <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {latestArticles.map((article) => (
              <SpotlightCard key={article.id} className="group relative flex flex-col items-start justify-between bg-transparent border border-gray-800/50 p-5 sm:p-6 transition-all duration-300 hud-border">
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-gray-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {article.coverImage && (
                  <div className="w-full h-40 mb-4 rounded overflow-hidden border border-gray-800/80 bg-gray-950/80 relative z-10">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/50 via-transparent to-transparent pointer-events-none" />
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-gray-500 mb-4 z-10">
                  <time dateTime={article.date}>{article.date}</time>
                  <span className="text-cyan-500/50">•</span>
                  <span>{article.readTime}</span>
                </div>
                <div className="group relative z-10">
                  <h3 className="mt-2 text-base sm:text-lg font-semibold leading-snug text-gray-100 group-hover:text-cyan-400 transition-colors">
                    <Link to={`/articles/${article.slug}`}>
                      <span className="absolute inset-0" />
                      {article.title}
                    </Link>
                  </h3>
                  <p className="mt-3 line-clamp-3 text-xs sm:text-sm leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors">
                    {article.summary}
                  </p>
                </div>
                <div className="relative mt-6 flex items-center gap-x-4 z-10">
                  <div className="text-xs font-mono px-2 py-1 rounded bg-gray-900 border border-gray-800 text-cyan-500/70 group-hover:border-cyan-900/50 transition-colors">
                    {article.area}
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </motion.section>

        {/* Research Areas */}
        <motion.section 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mb-14 sm:mb-20 md:mb-24"
        >
          <motion.div variants={itemVariants} className="flex items-end justify-between mb-8 sm:mb-12 border-b border-gray-800 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans mb-1.5 cursor-crosshair">
                <DecodeText text={t.home.areasTitle} delay={0} />
              </h2>
              <p className="text-gray-500 font-mono text-xs sm:text-sm">{t.home.areasSubtitle}</p>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {researchAreas.map((area) => {
              const Icon = area.icon;
              return (
                <SpotlightCard key={area.id} className="p-5 sm:p-6 cursor-crosshair">
                  <Icon className="w-8 h-8 text-gray-500 group-hover:text-cyan-400 transition-colors mb-4 relative z-10" />
                  <h3 className="text-lg font-semibold text-white mb-2 relative z-10">{area.title}</h3>
                  <p className="text-sm text-gray-400 relative z-10">{area.desc}</p>
                </SpotlightCard>
              );
            })}
          </div>
        </motion.section>

        {/* Insights */}
        <motion.section 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mb-14 sm:mb-20 md:mb-24"
        >
          <motion.div variants={itemVariants} className="flex items-end justify-between mb-6 sm:mb-8 border-b border-gray-800 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans cursor-crosshair mb-1.5">
                <DecodeText text={t.home.notesTitle} delay={0} />
              </h2>
              <p className="text-gray-500 font-mono text-xs sm:text-sm">{t.home.notesSubtitle}</p>
            </div>
            <Link to="/insights" className="text-cyan-400 font-mono text-xs sm:text-sm hover:text-cyan-300 py-1 flex items-center gap-1">
              {t.home.btnGoInsights} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNotes.map((note) => {
              const displayTag = note.contentType || note.tag || (Array.isArray(note.tags) ? note.tags[0] : 'Insight');
              return (
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  key={note.id} 
                  className="flex flex-col justify-between border-t border-gray-800 pt-4 relative group cursor-crosshair"
                >
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-500/50 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono text-gray-500">{note.date}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${getTagBadgeStyle(displayTag)}`}>
                        {displayTag}
                      </span>
                    </div>
                    {note.title && (
                      <h4 className="text-sm font-bold text-white mb-1.5 font-sans group-hover:text-cyan-300 transition-colors">
                        {note.title}
                      </h4>
                    )}
                    <p className="text-sm text-gray-300 leading-relaxed group-hover:text-white transition-colors mb-3">
                      {note.content}
                    </p>
                  </div>
                  {note.author && (
                    <div className="pt-2 border-t border-gray-800/40 flex items-center justify-end mt-2">
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${getAuthorBadgeStyle(note.author)}`}>
                        {note.author}
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.section>

      </div>
    </div>
  );
}
