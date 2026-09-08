import { Github, Linkedin, Rss } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="relative border-t border-gray-800/50 mt-24 overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <span className="font-mono text-lg font-bold tracking-tighter text-white">
              OT-SEC<span className="text-cyan-500">.</span>
            </span>
            <p className="mt-4 text-sm text-gray-500 font-sans max-w-xs">
              Independent research on Industrial Cybersecurity, Power Grid Security, Artificial Intelligence and Critical Infrastructure.
            </p>
          </div>
          
          <div>
            <h3 className="text-xs font-mono tracking-widest text-gray-400 uppercase mb-4">Sitemap</h3>
            <ul className="space-y-2">
              {['Articles', 'Research', 'Projects', 'About'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase()}`} className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-mono tracking-widest text-gray-400 uppercase mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-rose-500 transition-colors">
                <Rss className="w-5 h-5" />
              </a>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xs font-mono tracking-widest text-gray-400 uppercase mb-4">Newsletter</h3>
              <form className="flex" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="bg-transparent border border-gray-800 text-sm px-3 py-2 rounded-l focus:outline-none focus:border-cyan-500 text-white w-full"
                />
                <button type="submit" className="bg-gray-800 text-white px-3 py-2 text-sm rounded-r hover:bg-gray-700 transition-colors border border-gray-800">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-600 font-mono">
            &copy; {new Date().getFullYear()} OT-SEC Digital Research Lab. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0 text-xs font-mono text-cyan-500/70">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse"></span>
            <span className="tracking-widest">SYSTEM.ONLINE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
