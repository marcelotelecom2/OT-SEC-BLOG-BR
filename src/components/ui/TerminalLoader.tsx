import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface TerminalLoaderProps {
  onComplete: () => void;
  text?: string;
}

export function TerminalLoader({ onComplete, text = "INITIALIZING SECURE CONNECTION..." }: TerminalLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentAction, setCurrentAction] = useState(text);

  useEffect(() => {
    const actions = [
      text,
      "ESTABLISHING HANDSHAKE...",
      "EXCHANGING KEYS...",
      "DECRYPTING PAYLOAD...",
      "ACCESS GRANTED."
    ];
    
    let currentStep = 0;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 15;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        
        if (next > (currentStep + 1) * 20 && currentStep < actions.length - 1) {
          currentStep++;
          setCurrentAction(actions[currentStep]);
        }
        
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete, text]);

  return (
    <div className="flex flex-col items-center justify-center py-24 font-mono w-full">
      <div className="w-64 max-w-full">
        <div className="flex justify-between text-xs text-cyan-500 mb-2">
          <span className="tracking-widest">{currentAction}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-gray-900 w-full overflow-hidden border border-gray-800">
          <motion.div 
            className="h-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
