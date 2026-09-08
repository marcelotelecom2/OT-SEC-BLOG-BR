import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Filter, Tag, Hash, ShieldAlert, X, ExternalLink } from 'lucide-react';
import { DecodeText } from '../components/ui/DecodeText';
import { TerminalLoader } from '../components/ui/TerminalLoader';
import { useBlog } from '../context/BlogContext';
import { 
  CONTENT_TYPES, 
  getNoteContentType, 
  getContentTypeBadgeStyle,
  getNoteTags,
  getTagBadgeStyle
} from '../constants/researchClassification';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function Research() {
  const { notes, recordPageView } = useBlog();
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  useEffect(() => {
    recordPageView('/insights');
  }, []);

  // Dynamically extract unique technical tags from the actual notes content
  const availableTags = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((note) => {
      getNoteTags(note).forEach((t) => set.add(t));
    });
    return Array.from(set).sort();
  }, [notes]);

  const filteredNotes = notes.filter((note) => {
    if (note.published === false) return false;

    const noteType = getNoteContentType(note);
    const matchesType = selectedType === 'All' || noteType.toLowerCase() === selectedType.toLowerCase();

    const noteTags = getNoteTags(note);
    const matchesTag = selectedTag === 'All' || noteTags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

    return matchesType && matchesTag;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-[80vh]">
      {/* Header */}
      <div className="border-b border-gray-800 pb-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-3 cursor-crosshair">
              <DecodeText text="Insights" delay={100} />
            </h1>
            <p className="text-gray-400 font-mono text-sm">
              Standardized lab observation logs, vulnerability disclosures, and incident notes.
            </p>
          </div>
          <div className="font-mono text-xs text-gray-500 flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              CONTENT TYPE
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              TECHNICAL TAGS
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-10 space-y-4 bg-gray-950/60 p-4 rounded border border-gray-800/80 font-mono text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span className="uppercase tracking-wider">Classification Filter:</span>
          </div>
          {(selectedType !== 'All' || selectedTag !== 'All') && (
            <button
              onClick={() => {
                setSelectedType('All');
                setSelectedTag('All');
              }}
              className="text-gray-400 hover:text-white flex items-center gap-1 text-[11px] underline"
            >
              <X className="w-3 h-3 text-rose-400" /> Reset Filters
            </button>
          )}
        </div>

        {/* Content Type Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-gray-500 mr-1 flex items-center gap-1">
            <Tag className="w-3 h-3 text-cyan-400" /> Content Type:
          </span>
          <button
            onClick={() => setSelectedType('All')}
            className={`px-2.5 py-1 rounded text-xs transition-colors border ${
              selectedType === 'All'
                ? 'bg-gray-800 text-white border-gray-600 shadow-[0_0_8px_rgba(255,255,255,0.15)]'
                : 'text-gray-400 border-gray-800 hover:border-gray-700 bg-gray-900/40'
            }`}
          >
            All
          </button>
          {CONTENT_TYPES.map((t) => {
            const isSelected = selectedType === t.value;
            return (
              <button
                key={t.value}
                onClick={() => setSelectedType(isSelected ? 'All' : t.value)}
                className={`px-2.5 py-1 rounded text-xs border transition-all ${
                  isSelected
                    ? `${t.badgeClass} ring-1 ring-cyan-400/50 shadow-[0_0_8px_rgba(34,211,238,0.25)]`
                    : 'text-gray-400 border-gray-800/80 hover:border-gray-700 bg-gray-900/40'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Technical Tags Filter (dynamic from contents) */}
        {availableTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-900">
            <span className="text-gray-500 mr-1 flex items-center gap-1">
              <Hash className="w-3 h-3 text-emerald-400" /> Technical Tags:
            </span>
            <button
              onClick={() => setSelectedTag('All')}
              className={`px-2.5 py-1 rounded text-xs transition-colors border ${
                selectedTag === 'All'
                  ? 'bg-gray-800 text-white border-gray-600 shadow-[0_0_8px_rgba(255,255,255,0.15)]'
                  : 'text-gray-400 border-gray-800 hover:border-gray-700 bg-gray-900/40'
              }`}
            >
              All Tags
            </button>
            {availableTags.map((tag) => {
              const isSelected = selectedTag.toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(isSelected ? 'All' : tag)}
                  className={`px-2 py-0.5 rounded text-[11px] border transition-all ${
                    isSelected
                      ? `${getTagBadgeStyle(tag)} ring-1 ring-white/50 shadow-[0_0_8px_rgba(52,211,153,0.25)] font-bold`
                      : 'text-gray-400 border-gray-800/80 hover:border-gray-700 bg-gray-900/40'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        )}
      </div>
      
      {!isLoaded ? (
        <TerminalLoader onComplete={() => setIsLoaded(true)} text="ACCESSING LOGS..." />
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {filteredNotes.length === 0 ? (
            <div className="text-gray-500 font-mono text-center py-16 border border-dashed border-gray-800 rounded">
              <ShieldAlert className="w-8 h-8 text-gray-600 mx-auto mb-3" />
              <p>No insights match the selected classification filters.</p>
              {(selectedType !== 'All' || selectedTag !== 'All') && (
                <button
                  onClick={() => {
                    setSelectedType('All');
                    setSelectedTag('All');
                  }}
                  className="mt-3 px-3 py-1 bg-gray-900 border border-gray-700 text-cyan-400 hover:text-white rounded text-xs transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            filteredNotes.map((note) => {
              const noteType = getNoteContentType(note);
              const noteTags = getNoteTags(note);
              return (
                <motion.div 
                  key={note.id} 
                  variants={itemVariants}
                  className="flex flex-col gap-3 border-l-2 border-gray-800/80 pl-6 relative group py-3 transition-colors hover:border-cyan-500/50"
                >
                  {/* Visual indicator node on the timeline */}
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-gray-800 group-hover:bg-cyan-400 -left-[6px] top-4 transition-all shadow-[0_0_8px_rgba(34,211,238,0)] group-hover:shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
                  
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                      <span className="text-xs font-mono text-gray-500">{note.date}</span>
                      
                      {/* Standardized Content Type in Cyberpunk/Industrial tone */}
                      <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded border font-semibold tracking-wider ${getContentTypeBadgeStyle(noteType)}`}>
                        {noteType}
                      </span>

                      {/* Technical Tags: Clickable to filter */}
                      {noteTags.map((tag) => {
                        const isSelected = selectedTag.toLowerCase() === tag.toLowerCase();
                        return (
                          <button
                            key={tag}
                            onClick={() => setSelectedTag(isSelected ? 'All' : tag)}
                            title={`Filter by #${tag}`}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border tracking-wider transition-all hover:scale-105 ${getTagBadgeStyle(tag)} ${
                              isSelected ? 'ring-1 ring-white/60 shadow-sm' : 'opacity-90 hover:opacity-100'
                            }`}
                          >
                            #{tag}
                          </button>
                        );
                      })}

                      {note.author && (
                        <span className="text-[10px] font-mono text-gray-500 ml-auto">
                          #{note.author.replace(/^#/, '')}
                        </span>
                      )}
                    </div>

                    {note.title && (
                      <h3 className="text-base md:text-lg font-bold text-white mb-1.5 font-sans group-hover:text-cyan-300 transition-colors">
                        {note.title}
                      </h3>
                    )}

                    {note.summary && (
                      <p className="text-xs font-mono text-cyan-300/90 mb-2 leading-relaxed bg-cyan-950/20 p-2 rounded border border-cyan-900/40">
                        {note.summary}
                      </p>
                    )}

                    <p className="text-sm md:text-base text-gray-300 font-sans leading-relaxed group-hover:text-white transition-colors">
                      {note.content}
                    </p>

                    {(note.sourceName || note.sourceUrl) && (
                      <div className="mt-3 pt-2 border-t border-gray-800/60 flex items-center gap-2 text-xs font-mono text-gray-400">
                        <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="text-gray-500">Source:</span>
                        {note.sourceUrl ? (
                          <a
                            href={note.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:underline hover:text-cyan-300 truncate transition-colors"
                          >
                            {note.sourceName || note.sourceUrl}
                          </a>
                        ) : (
                          <span className="text-gray-300">{note.sourceName}</span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      )}
    </div>
  );
}
