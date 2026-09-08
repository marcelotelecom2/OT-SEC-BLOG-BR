import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface DecodeTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';

export function DecodeText({ text, className = '', delay = 0 }: DecodeTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let frameId: number;

    const animate = () => {
      let iteration = 0;
      
      const updateText = () => {
        setDisplayText(
          text
            .split('')
            .map((char, index) => {
              if (index < iteration) {
                return text[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );

        if (iteration >= text.length) {
          setHasAnimated(true);
          return;
        }

        iteration += 1 / 3;
        frameId = requestAnimationFrame(updateText);
      };

      updateText();
    };

    if (!hasAnimated) {
      timeout = setTimeout(animate, delay);
    } else if (isHovered) {
      animate();
    } else {
       setDisplayText(text);
    }

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frameId);
    };
  }, [text, delay, isHovered, hasAnimated]);

  return (
    <motion.span
      className={`inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
    >
      {displayText || ' '}
    </motion.span>
  );
}
