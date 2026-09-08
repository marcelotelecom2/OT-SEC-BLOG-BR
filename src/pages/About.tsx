import { motion } from 'motion/react';
import { DecodeText } from '../components/ui/DecodeText';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { Terminal, Shield, Network } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="border-b border-gray-800 pb-8 mb-12">
        <h1 className="text-4xl font-bold text-white tracking-tight mb-4 cursor-crosshair">
          <DecodeText text="About the Lab" delay={100} />
        </h1>
        <p className="text-gray-400 font-mono text-sm">Mission, methodology, and operational principles.</p>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="prose prose-invert prose-p:text-gray-400 prose-headings:text-white prose-a:text-cyan-400 max-w-none"
      >
        <p className="text-lg leading-relaxed mb-8">
          The <strong className="text-gray-200">OT-SEC Digital Research Lab</strong> is an independent initiative dedicated to exploring the intersection of Industrial Cybersecurity, Artificial Intelligence, and Critical Infrastructure.
        </p>

        <SpotlightCard className="p-8 mb-12 border-l-2 border-l-cyan-500">
          <h2 className="text-xl font-bold mb-4 font-sans flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            Our Mission
          </h2>
          <p className="m-0 text-gray-400">
            To bridge the gap between legacy operational technology (OT) systems and modern security paradigms. As adversaries shift focus from IT data theft to physical kinetic impacts, our goal is to provide actionable intelligence, open-source tooling, and architectural guidance to ensure the resilience of the systems that power our world.
          </p>
        </SpotlightCard>

        <h3 className="text-2xl font-semibold mb-6">Methodology</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="border border-gray-800/50 p-6 bg-gray-900/20">
            <Shield className="w-6 h-6 text-cyan-500 mb-4" />
            <h4 className="text-lg font-medium text-gray-200 mb-2">Offensive Research</h4>
            <p className="text-sm text-gray-400">
              We study adversary tactics, techniques, and procedures (TTPs) specific to industrial control systems to build better defenses.
            </p>
          </div>
          <div className="border border-gray-800/50 p-6 bg-gray-900/20">
            <Network className="w-6 h-6 text-cyan-500 mb-4" />
            <h4 className="text-lg font-medium text-gray-200 mb-2">Protocol Analysis</h4>
            <p className="text-sm text-gray-400">
              Deep packet inspection and reverse engineering of proprietary SCADA protocols to identify inherent design flaws and zero-day vulnerabilities.
            </p>
          </div>
        </div>

        <h3 className="text-2xl font-semibold mb-6">Contact & Collaboration</h3>
        <p>
          We collaborate with asset owners, vendors, and academic institutions. For secure communications regarding vulnerability disclosures, threat intelligence sharing, or research partnerships, please reach out via encrypted channels.
        </p>
        
        <div className="mt-8 font-mono text-sm p-4 bg-[#0a0a0a] border border-gray-800 rounded">
          <div className="text-gray-500 mb-2">PGP FINGERPRINT:</div>
          <div className="text-cyan-400 break-all">A1B2 C3D4 E5F6 7890 1234  5678 90AB CDEF 1234 5678</div>
        </div>
      </motion.div>
    </div>
  );
}
