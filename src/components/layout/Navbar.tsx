import { Link, useLocation } from 'react-router-dom';
import { Search, Menu } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Articles', path: '/articles' },
  { name: 'Insights', path: '/insights' },
  { name: 'Projects', path: '/projects' },
  { name: 'About', path: '/about' },
];

export function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full bg-[#050505]/40 backdrop-blur-2xl border-b border-gray-800/30 supports-[backdrop-filter]:bg-[#050505]/20">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-rose-500/0 h-[1px] bottom-0" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex flex-col">
              <span className="font-mono text-lg font-bold tracking-tighter text-white">
                OT-SEC<span className="text-cyan-500">.</span>
              </span>
              <span className="text-[10px] tracking-widest text-gray-500 font-mono uppercase">
                Research Lab
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "relative text-sm font-medium transition-colors hover:text-cyan-400 font-sans tracking-wide group flex items-center gap-1",
                  location.pathname === link.path ? "text-white" : "text-gray-400"
                )}
              >
                {link.name}
                {location.pathname === link.path ? (
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                ) : (
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-cyan-400/50 rounded-full transition-all duration-300 group-hover:w-full" />
                )}
              </Link>
            ))}
            <button className="text-gray-400 hover:text-cyan-400 transition-colors p-2 hover:bg-gray-800/50 rounded-full">
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-800 bg-[#0a0a0a]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  location.pathname === link.path ? "text-cyan-400 bg-gray-900" : "text-gray-400 hover:text-white hover:bg-gray-800"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
