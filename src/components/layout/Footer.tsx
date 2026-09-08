import { Github, Linkedin, Rss } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="relative border-t border-gray-800/50 mt-16 sm:mt-24 overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <span className="font-mono text-lg font-bold tracking-tighter text-white">
              OT-SEC<span className="text-cyan-500">.</span>
            </span>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 font-sans max-w-sm leading-relaxed">
              Independent research on Industrial Cybersecurity, Power Grid Security, Artificial Intelligence and Critical Infrastructure.
            </p>
          </div>
          
          <div>
            <h3 className="text-xs font-mono tracking-widest text-gray-400 uppercase mb-3 sm:mb-4">Sitemap</h3>
            <ul className="space-y-1">
              {[
                { name: 'Articles', path: '/articles' },
                { name: 'Insights', path: '/insights' },
                { name: 'Projects', path: '/projects' },
                { name: 'About', path: '/about' },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-xs sm:text-sm text-gray-500 hover:text-cyan-400 transition-colors py-1.5 inline-block">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-mono tracking-widest text-gray-400 uppercase mb-3 sm:mb-4">Connect</h3>
            <div className="flex items-center space-x-2">
              <a href="#" className="text-gray-500 hover:text-white transition-colors w-9 h-9 rounded flex items-center justify-center hover:bg-gray-900" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors w-9 h-9 rounded flex items-center justify-center hover:bg-gray-900" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-500 hover:text-rose-500 transition-colors w-9 h-9 rounded flex items-center justify-center hover:bg-gray-900" aria-label="RSS Feed">
                <Rss className="w-4 h-4" />
              </a>
            </div>
            
            <div className="mt-6 sm:mt-8">
              <h3 className="text-xs font-mono tracking-widest text-gray-400 uppercase mb-3">Newsletter</h3>
              <form className="flex max-w-sm" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="bg-gray-950 border border-gray-800 text-xs sm:text-sm px-3 py-2 rounded-l focus:outline-none focus:border-cyan-500 text-white w-full min-h-[40px] font-mono"
                />
                <button type="submit" className="bg-gray-800 text-white px-3 sm:px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-r hover:bg-gray-700 transition-colors border border-gray-800 shrink-0 min-h-[40px]">
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[11px] sm:text-xs text-gray-600 font-mono text-center sm:text-left">
            &copy; {new Date().getFullYear()} OT-SEC Digital Research Lab. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-500/70">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse"></span>
            <span className="tracking-widest text-[11px]">SYSTEM.ONLINE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
