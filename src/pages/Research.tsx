import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Filter, Tag, UserCheck, ShieldAlert, Cpu } from 'lucide-react';
import { DecodeText } from '../components/ui/DecodeText';
import { TerminalLoader } from '../components/ui/TerminalLoader';
import { useBlog } from '../context/BlogContext';
import { 
  RESEARCH_TAGS, 
  RESEARCH_AUTHORS, 
  getTagBadgeStyle, 
  getAuthorBadgeStyle 
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
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('ALL');

  useEffect(() => {
    recordPageView('/research');
  }, []);

  const filteredNotes = notes.filter((note) => {
    const matchesTag = selectedTag === 'ALL' || note.tag.toLowerCase() === selectedTag.toLowerCase();
    const matchesAuthor = selectedAuthor === 'ALL' || (note.author && note.author.toLowerCase() === selectedAuthor.toLowerCase());
    return matchesTag && matchesAuthor;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-[80vh]">
      {/* Header */}
      <div className="border-b border-gray-800 pb-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-3 cursor-crosshair">
              <DecodeText text="Research Notes" delay={100} />
            </h1>
            <p className="text-gray-400 font-mono text-sm">
              Standardized lab observation logs, vulnerability disclosures, and incident notes.
            </p>
          </div>
          <div className="font-mono text-xs text-gray-500 flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              THREAT CLASSIFICATIONS
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              RESEARCH OPERATORS
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-10 space-y-4 bg-gray-950/60 p-4 rounded border border-gray-800/80 font-mono text-xs">
        <div className="flex items-center gap-2 text-gray-400">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span className="uppercase tracking-wider">Classification Filter:</span>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-gray-500 mr-1 flex items-center gap-1">
            <Tag className="w-3 h-3 text-rose-400" /> Tags:
          </span>
          <button
            onClick={() => setSelectedTag('ALL')}
            className={`px-2.5 py-1 rounded text-xs transition-colors border ${
              selectedTag === 'ALL'
                ? 'bg-gray-800 text-white border-gray-600'
                : 'text-gray-400 border-gray-800 hover:border-gray-700'
            }`}
          >
            ALL TAGS
          </button>
          {RESEARCH_TAGS.map((t) => {
            const isSelected = selectedTag === t.value;
            return (
              <button
                key={t.value}
                onClick={() => setSelectedTag(isSelected ? 'ALL' : t.value)}
                className={`px-2 py-0.5 rounded text-[11px] border transition-all ${
                  isSelected
                    ? `${t.badgeClass} ring-1 ring-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.3)]`
                    : 'text-gray-400 border-gray-800/80 hover:border-gray-700 bg-gray-900/40'
                }`}
              >
                {t.value}
              </button>
            );
          })}
        </div>

        {/* Author Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-900">
          <span className="text-gray-500 mr-1 flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-cyan-400" /> Operators:
          </span>
          <button
            onClick={() => setSelectedAuthor('ALL')}
            className={`px-2.5 py-1 rounded text-xs transition-colors border ${
              selectedAuthor === 'ALL'
                ? 'bg-gray-800 text-white border-gray-600'
                : 'text-gray-400 border-gray-800 hover:border-gray-700'
            }`}
          >
            ALL OPERATORS
          </button>
          {RESEARCH_AUTHORS.map((a) => {
            const isSelected = selectedAuthor === a.value;
            return (
              <button
                key={a.value}
                onClick={() => setSelectedAuthor(isSelected ? 'ALL' : a.value)}
                className={`px-2 py-0.5 rounded text-[11px] border transition-all ${
                  isSelected
                    ? `${a.badgeClass} ring-1 ring-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.3)]`
                    : 'text-gray-400 border-gray-800/80 hover:border-gray-700 bg-gray-900/40'
                }`}
              >
                #{a.value}
              </button>
            );
          })}
        </div>
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
              No research notes match the selected classification filters.
            </div>
          ) : (
            filteredNotes.map((note) => (
              <motion.div 
                key={note.id} 
                variants={itemVariants}
                className="flex flex-col gap-3 border-l-2 border-gray-800/80 pl-6 relative group py-3 transition-colors hover:border-cyan-500/50"
              >
                {/* Visual indicator node on the timeline */}
                <div className="absolute w-2.5 h-2.5 rounded-full bg-gray-800 group-hover:bg-cyan-400 -left-[6px] top-4 transition-all shadow-[0_0_8px_rgba(34,211,238,0)] group-hover:shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
                
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2.5">
                    <span className="text-xs font-mono text-gray-500">{note.date}</span>
                    
                    {/* Standardized Tag in Red/Thematic tone */}
                    <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded border font-semibold tracking-wider ${getTagBadgeStyle(note.tag)}`}>
                      {note.tag}
                    </span>

                    {/* Standardized Operator/Author in Blue/Cyan tone */}
                    {note.author && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border tracking-wider ml-auto ${getAuthorBadgeStyle(note.author)}`}>
                        #{note.author.replace(/^#/, '')}
                      </span>
                    )}
                  </div>

                  <p className="text-sm md:text-base text-gray-300 font-sans leading-relaxed group-hover:text-white transition-colors">
                    {note.content}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}
