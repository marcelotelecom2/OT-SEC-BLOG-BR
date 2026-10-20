import { motion } from 'motion/react';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { Terminal, Shield, Network } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function About() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
      <div className="border-b border-gray-800 pb-6 sm:pb-8 mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2 sm:mb-4 cursor-crosshair">
          {t.about.title}
        </h1>
        <p className="text-gray-400 font-mono text-xs sm:text-sm">{t.about.subtitle}</p>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="prose prose-invert prose-p:text-gray-400 prose-headings:text-white prose-a:text-cyan-400 max-w-none text-sm sm:text-base leading-relaxed"
      >
        <p className="text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
          {t.about.intro}
        </p>

        <SpotlightCard className="p-5 sm:p-6 md:p-8 mb-8 sm:mb-12 border-l-2 border-l-cyan-500">
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 font-sans flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400 shrink-0" />
            {t.about.missionTitle}
          </h2>
          <p className="m-0 text-gray-400 text-sm sm:text-base">
            {t.about.missionText}
          </p>
        </SpotlightCard>

        <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">{t.about.methodTitle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="border border-gray-800/50 p-5 sm:p-6 bg-gray-900/20 rounded">
            <Shield className="w-6 h-6 text-cyan-500 mb-3 sm:mb-4" />
            <h4 className="text-base sm:text-lg font-medium text-gray-200 mb-2">{t.about.offensiveTitle}</h4>
            <p className="text-xs sm:text-sm text-gray-400">
              {t.about.offensiveText}
            </p>
          </div>
          <div className="border border-gray-800/50 p-5 sm:p-6 bg-gray-900/20 rounded">
            <Network className="w-6 h-6 text-cyan-500 mb-3 sm:mb-4" />
            <h4 className="text-base sm:text-lg font-medium text-gray-200 mb-2">{t.about.protocolTitle}</h4>
            <p className="text-xs sm:text-sm text-gray-400">
              {t.about.protocolText}
            </p>
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">{t.about.contactTitle}</h3>
        <p className="text-sm sm:text-base">
          {t.about.contactText}
        </p>
        
        <div className="mt-6 sm:mt-8 font-mono text-xs sm:text-sm p-4 bg-[#0a0a0a] border border-gray-800 rounded">
          <div className="text-gray-500 mb-1.5">{t.about.pgpFingerprint}</div>
          <div className="text-cyan-400 break-all select-all font-mono">A1B2 C3D4 E5F6 7890 1234  5678 90AB CDEF 1234 5678</div>
        </div>
      </motion.div>
    </div>
  );
}
