import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { DecodeText } from '../components/ui/DecodeText';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { TerminalLoader } from '../components/ui/TerminalLoader';
import { ArrowRight, Github, ExternalLink } from 'lucide-react';
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
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function Projects() {
  const { projects, recordPageView } = useBlog();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    recordPageView('/projects');
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-[80vh]">
      <div className="border-b border-gray-800 pb-8 mb-12">
        <h1 className="text-4xl font-bold text-white tracking-tight mb-4 cursor-crosshair">
          <DecodeText text="Projects & Tools" delay={100} />
        </h1>
        <p className="text-gray-400 font-mono text-sm">Applied research, open-source tools, and platforms.</p>
      </div>
      
      {!isLoaded ? (
        <TerminalLoader onComplete={() => setIsLoaded(true)} text="LOADING REPOSITORIES..." />
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={itemVariants}>
              <SpotlightCard className="h-full flex flex-col p-8 group relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-transparent">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-cyan-500/10 transition-colors"></div>
                
                <div className="inline-flex items-center px-2 py-1 mb-6 rounded text-[10px] font-mono border border-cyan-900/50 text-cyan-400 self-start z-10 bg-cyan-950/20">
                  {project.status}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 z-10 group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow z-10">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-8 z-10">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs font-mono px-2 py-1 bg-gray-900 border border-gray-800 rounded text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-800/50 z-10">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                  <div className="ml-auto inline-flex items-center text-sm font-mono text-cyan-500 hover:text-cyan-300 transition-colors group/link">
                    View Docs <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
