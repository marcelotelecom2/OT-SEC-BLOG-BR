import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { BookOpen, Compass, Radio, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function About() {
  const { t } = useLanguage();
  const about = t.about;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
      <header className="border-b border-gray-800 pb-6 sm:pb-8 mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3 sm:mb-4">{about.title}</h1>
        <p className="text-gray-400 font-mono text-xs sm:text-sm leading-relaxed">{about.subtitle}</p>
      </header>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="text-sm sm:text-base leading-relaxed text-gray-400">
        <div className="space-y-5 mb-8 sm:mb-12">
          {about.introduction.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {[
            { title: about.missionTitle, text: about.missionText, icon: Shield },
            { title: about.visionTitle, text: about.visionText, icon: Compass },
          ].map(({ title, text, icon: Icon }) => <SpotlightCard key={title} className="p-5 sm:p-6 border-l-2 border-l-cyan-500">
            <h2 className="text-lg sm:text-xl text-white font-semibold mb-3 flex items-center gap-2">
              <Icon aria-hidden="true" className="w-5 h-5 text-cyan-400 shrink-0" />{title}
            </h2>
            <p>{text}</p>
          </SpotlightCard>)}
        </div>

        <section aria-labelledby="about-values" className="mb-8 sm:mb-12">
          <h2 id="about-values" className="text-xl sm:text-2xl text-white font-semibold mb-5">{about.valuesTitle}</h2>
          <dl className="divide-y divide-gray-800/70 border-y border-gray-800/70">
            {about.values.map(value => <div key={value.title} className="py-4 sm:py-5">
              <dt className="text-gray-100 font-medium mb-2">{value.title}</dt>
              <dd className="text-sm sm:text-base">{value.text}</dd>
            </div>)}
          </dl>
        </section>

        <section aria-labelledby="about-activities">
          <h2 id="about-activities" className="text-xl sm:text-2xl text-white font-semibold mb-4">{about.activitiesTitle}</h2>
          <p className="mb-5 sm:mb-6">{about.activitiesIntro}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[
              { title: about.studiesTitle, text: about.studiesText, path: '/articles', icon: BookOpen },
              { title: about.radarTitle, text: about.radarText, path: '/insights', icon: Radio },
            ].map(({ title, text, path, icon: Icon }) => <div key={path} className="border border-gray-800/50 p-5 sm:p-6 bg-gray-900/20 rounded">
              <Icon aria-hidden="true" className="w-5 h-5 text-cyan-500 mb-3" />
              <h3 className="text-base sm:text-lg font-medium mb-2"><Link to={path} className="text-cyan-400 hover:text-cyan-300 hover:underline focus-visible:outline focus-visible:outline-cyan-400">{title}</Link></h3>
              <p className="text-sm">{text}</p>
            </div>)}
          </div>
          <p className="mt-6 sm:mt-8 text-xs sm:text-sm font-mono text-gray-500 leading-relaxed">{about.publicationNote}</p>
        </section>
      </motion.div>
    </div>
  );
}
