import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-crosshair') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 border border-cyan-500 rounded-full pointer-events-none z-[9999] mix-blend-screen flex items-center justify-center"
        animate={{
          x: position.x - 8,
          y: position.y - 8,
          scale: isHovering ? 2 : 1,
          backgroundColor: isHovering ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
      >
        <motion.div 
          className="w-1 h-1 bg-cyan-400 rounded-full"
          animate={{
            opacity: isHovering ? 0 : 1,
          }}
        />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full pointer-events-none z-[9998] blur-2xl mix-blend-screen"
        animate={{
          x: position.x - 64,
          y: position.y - 64,
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.5 }}
      />
    </>
  );
}
