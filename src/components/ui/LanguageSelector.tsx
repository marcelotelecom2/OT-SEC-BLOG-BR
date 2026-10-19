import { useState, useRef, useEffect } from 'react';
import { useLanguage, LANGUAGE_OPTIONS } from '../../context/LanguageContext';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className = '' }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const currentOption = LANGUAGE_OPTIONS.find((opt) => opt.code === language) || LANGUAGE_OPTIONS[0];

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Botão minimalista: Globo + [PT]/[EN]/[ES] */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-mono transition-all duration-200 border ${
          isOpen
            ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
            : 'bg-gray-950/60 border-gray-800 text-gray-300 hover:text-white hover:border-gray-700 hover:bg-gray-900/60'
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`${t.nav.switchLanguage}: [${currentOption.shortLabel}]`}
        title={`${t.nav.switchLanguage}: [${currentOption.shortLabel}]`}
      >
        <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span className="tracking-wider font-semibold text-cyan-200 text-xs">
          [{currentOption.shortLabel}]
        </span>
        <ChevronDown
          className={`w-3 h-3 text-gray-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-cyan-400' : ''
          }`}
        />
      </button>

      {/* Menu Suspenso (Dropdown) */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-lg bg-[#0a0c12]/95 border border-cyan-900/60 shadow-[0_8px_30px_rgba(0,0,0,0.85)] backdrop-blur-xl z-50 p-1.5 font-mono text-xs focus:outline-none"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-2.5 py-1.5 mb-1 border-b border-gray-800/80 text-[10px] text-gray-500 uppercase tracking-widest flex items-center justify-between">
            <span>{t.nav.switchLanguage}</span>
            <span className="text-cyan-400 font-bold">[{currentOption.shortLabel}]</span>
          </div>

          <div className="space-y-0.5">
            {LANGUAGE_OPTIONS.map((opt) => {
              const isSelected = language === opt.code;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => {
                    setLanguage(opt.code);
                    const articleRoute = location.pathname.match(/^\/(?:en|pt|es)\/articles\/([^/]+)\/?$/);
                    if (articleRoute) navigate(`/${opt.code}/articles/${articleRoute[1]}`);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left flex items-center justify-between px-2.5 py-2 rounded transition-colors text-xs ${
                    isSelected
                      ? 'bg-cyan-950/60 text-cyan-300 font-semibold border border-cyan-800/50 shadow-[0_0_8px_rgba(6,182,212,0.15)]'
                      : 'text-gray-300 hover:text-white hover:bg-gray-900/80 border border-transparent'
                  }`}
                  role="menuitem"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm select-none">{opt.flag}</span>
                    <span className="font-sans text-xs">{opt.label}</span>
                    <span className="text-[10px] text-cyan-400/80 font-mono font-semibold">[{opt.shortLabel}]</span>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
