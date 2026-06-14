'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-pill"
      aria-label={`Switch to ${theme === 'midnight' ? 'Champagne Gallery' : 'Midnight Gallery'} theme`}
    >
      <motion.div
        className="theme-toggle-slider"
        animate={{
          x: theme === 'champagne' ? 44 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        {theme === 'midnight' ? (
          <Moon className="w-4 h-4 text-[--color-bg-deep]" strokeWidth={2.5} />
        ) : (
          <Sun className="w-4 h-4 text-[--color-champagne]" strokeWidth={2.5} />
        )}
      </motion.div>
      
      <div className="theme-toggle-labels">
        <span className={`theme-toggle-label ${theme === 'midnight' ? 'active' : ''}`}>
          <Moon className="w-3.5 h-3.5" strokeWidth={2.5} />
        </span>
        <span className={`theme-toggle-label ${theme === 'champagne' ? 'active' : ''}`}>
          <Sun className="w-3.5 h-3.5" strokeWidth={2.5} />
        </span>
      </div>
    </button>
  );
}
