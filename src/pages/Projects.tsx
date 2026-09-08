import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { DecodeText } from '../components/ui/DecodeText';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { TerminalLoader } from '../components/ui/TerminalLoader';
import { ArrowRight, Github, ExternalLink } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { sanitizeExternalUrl } from '../lib/sanitizeUrl';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function Projects() {
  const { projects, recordPageView } = useBlog();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    recordPageView('/projects');
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 min-h-[80vh]">
      <div className="border-b border-gray-800 pb-6 sm:pb-8 mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2 sm:mb-4 cursor-crosshair">
          <DecodeText text="Projects & Tools" delay={100} />
        </h1>
        <p className="text-gray-400 font-mono text-xs sm:text-sm">Applied research, open-source tools, and platforms.</p>
      </div>
      
      {!isLoaded ? (
        <TerminalLoader onComplete={() => setIsLoaded(true)} text="LOADING REPOSITORIES..." />
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={itemVariants}>
              <SpotlightCard className="h-full flex flex-col p-5 sm:p-6 md:p-8 group relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-transparent">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-cyan-500/10 transition-colors pointer-events-none"></div>
                
                <div className="inline-flex items-center px-2 py-1 mb-4 sm:mb-6 rounded text-[10px] font-mono border border-cyan-900/50 text-cyan-400 self-start z-10 bg-cyan-950/20">
                  {project.status}
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 z-10 group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 sm:mb-8 flex-grow z-10">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 z-10">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs font-mono px-2 py-1 bg-gray-900 border border-gray-800 rounded text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 sm:gap-4 mt-auto pt-5 sm:pt-6 border-t border-gray-800/50 z-10">
                  {sanitizeExternalUrl(project.githubUrl) && (
                    <a 
                      href={sanitizeExternalUrl(project.githubUrl)!} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-400 hover:text-white transition-colors w-10 h-10 rounded-full hover:bg-gray-800 inline-flex items-center justify-center"
                      title="GitHub Repository"
                      aria-label="GitHub Repository"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {sanitizeExternalUrl(project.demoUrl) && (
                    <a 
                      href={sanitizeExternalUrl(project.demoUrl)!} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-400 hover:text-white transition-colors w-10 h-10 rounded-full hover:bg-gray-800 inline-flex items-center justify-center"
                      title="Documentation & Live Demo"
                      aria-label="Documentation & Live Demo"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                  {(() => {
                    const docUrl = sanitizeExternalUrl(project.demoUrl) || sanitizeExternalUrl(project.githubUrl);
                    if (!docUrl) return null;
                    return (
                      <a
                        href={docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto inline-flex items-center text-xs sm:text-sm font-mono text-cyan-500 hover:text-cyan-300 transition-colors group/link py-2"
                      >
                        View Docs <ArrowRight className="w-4 h-4 ml-1.5 group-hover/link:translate-x-1 transition-transform" />
                      </a>
                    );
                  })()}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
