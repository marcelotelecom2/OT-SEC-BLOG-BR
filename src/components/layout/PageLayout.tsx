import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { NoiseOverlay } from '../ui/NoiseOverlay';
import { CustomCursor } from '../ui/CustomCursor';
import { Scanlines } from '../ui/Scanlines';
import { motion, useScroll, useSpring } from 'motion/react';
import { applyDefaultSEO } from '../../lib/seo';

function PublicEffects() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-cyan-500 origin-left z-[100] shadow-[0_0_10px_rgba(34,211,238,0.8)] pointer-events-none"
        style={{ scaleX }}
      />
      <CustomCursor />
      <NoiseOverlay />
      <Scanlines />
    </>
  );
}

export function PageLayout() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  useLayoutEffect(() => {
    // Whenever current route is not an article detail page, ensure default institutional SEO
    if (!/^\/(?:en|pt|es)\/articles\//.test(location.pathname)) {
      applyDefaultSEO();
    }
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('admin-mode', isAdmin);
    return () => document.body.classList.remove('admin-mode');
  }, [isAdmin]);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip flex flex-col font-sans selection:bg-cyan-900 selection:text-cyan-100">
      {!isAdmin && <PublicEffects />}
      <Navbar />
      <main className="flex-grow relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
