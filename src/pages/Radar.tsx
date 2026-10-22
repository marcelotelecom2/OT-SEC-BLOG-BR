import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ExternalLink, Radio } from 'lucide-react';
import { PUBLISHED_RADAR } from 'virtual:published-articles';
import { useBlog } from '../context/BlogContext';
import { LANGUAGE_OPTIONS, useLanguage } from '../context/LanguageContext';
import { RADAR_TYPES, localizeRadar, originalSourceUrl, publicRadar } from '../lib/radar';
import type { RadarType } from '../types';

export function Radar() {
  const { language, t } = useLanguage();
  const { recordPageView, articles } = useBlog();
  const [type, setType] = useState<RadarType | 'all'>('all');
  useEffect(() => { recordPageView('/insights'); }, []);
  const entries = publicRadar(PUBLISHED_RADAR).filter(item => type === 'all' || item.type === type);
  const labels = t.radar;

  return <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 min-h-[80vh]">
    <header className="border-b border-gray-800 pb-6 sm:pb-8 mb-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">{labels.title}</h1>
      <p className="text-gray-400 font-mono text-xs sm:text-sm max-w-3xl leading-relaxed">{labels.subtitle}</p>
    </header>
    <div role="group" aria-label={labels.filter} className="flex flex-wrap gap-2 mb-8 bg-gray-950/60 p-4 rounded border border-gray-800/80">
      {(['all', ...RADAR_TYPES] as const).map(value => <button key={value} type="button" aria-pressed={type === value}
        onClick={() => setType(value)} className={`min-h-11 px-3 py-2 rounded border text-xs font-mono transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-400 ${type === value
          ? 'text-cyan-300 border-cyan-700 bg-cyan-950/30' : 'text-gray-400 border-gray-800 hover:text-white hover:border-cyan-800'}`}>
        {value === 'all' ? labels.all : labels.types[value]}
      </button>)}
    </div>
    {entries.length === 0 ? <div role="status" className="py-16 px-5 text-center border border-dashed border-gray-800 rounded">
      <Radio aria-hidden="true" className="w-8 h-8 text-cyan-500/60 mx-auto mb-4" />
      <p className="text-gray-300 font-mono text-sm">{PUBLISHED_RADAR.length ? labels.noResults : labels.empty}</p>
      {!PUBLISHED_RADAR.length && <p className="text-gray-500 text-sm mt-3 max-w-xl mx-auto leading-relaxed">{labels.emptyDetail}</p>}
    </div> : <div className="space-y-6">{entries.map(entry => {
      const item = localizeRadar(entry, language);
      const sourceUrl = originalSourceUrl(item.sourceUrl);
      return <motion.article key={`${entry.id}:${language}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="border border-gray-800/70 border-l-2 border-l-cyan-700/60 rounded p-5 sm:p-7 bg-gray-950/30 hover:border-l-cyan-400 transition-colors">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono mb-4">
          <time dateTime={item.date} className="text-gray-500">{new Intl.DateTimeFormat(language === 'pt' ? 'pt-BR' : language, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${item.date}T00:00:00Z`))}</time>
          <span className="px-2 py-1 rounded border border-cyan-900 bg-cyan-950/30 text-cyan-400">{labels.types[item.type]}</span>
        </div>
        <h2 lang={item.sourceLanguage} className="text-lg sm:text-xl font-semibold text-white break-words">{item.title}</h2>
        {item.sourceLanguage !== language && <p className="mt-2 text-xs text-amber-300/80">{labels.originalNotice.replace('{language}', LANGUAGE_OPTIONS.find(option => option.code === item.sourceLanguage)!.label)}</p>}
        <h3 className="text-xs font-mono text-cyan-400 mt-5 mb-2">{labels.comment}</h3>
        <p lang={item.sourceLanguage} className="text-sm sm:text-base leading-relaxed text-gray-300 whitespace-pre-wrap break-words">{item.comment}</p>
        {item.articleSlug && articles.some(article => article.published && article.slug === item.articleSlug) &&
          <Link to={`/${language}/articles/${item.articleSlug}`} className="inline-flex items-center min-h-11 mt-3 text-cyan-400 hover:text-cyan-300 hover:underline text-sm font-medium">{labels.readFull}</Link>}
        <div className="mt-5 pt-4 border-t border-gray-800 text-xs font-mono flex flex-wrap gap-2 items-center">
          <span className="text-gray-500">{labels.source}:</span>
          {sourceUrl ? <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 hover:underline break-all">
            {item.sourceName}<ExternalLink aria-hidden="true" className="w-3.5 h-3.5 shrink-0" />
          </a> : <span className="text-gray-400">{item.sourceName}</span>}
        </div>
      </motion.article>;
    })}</div>}
  </div>;
}
