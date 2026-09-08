import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { NoiseOverlay } from '../ui/NoiseOverlay';
import { CustomCursor } from '../ui/CustomCursor';
import { Scanlines } from '../ui/Scanlines';
import { motion, useScroll, useSpring } from 'motion/react';

export function PageLayout() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip flex flex-col font-sans selection:bg-cyan-900 selection:text-cyan-100">
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-cyan-500 origin-left z-[100] shadow-[0_0_10px_rgba(34,211,238,0.8)] pointer-events-none"
        style={{ scaleX }}
      />
      <CustomCursor />
      <NoiseOverlay />
      <Scanlines />
      <Navbar />
      <main className="flex-grow relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
