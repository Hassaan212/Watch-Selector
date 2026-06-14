'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'midnight' | 'champagne';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('midnight');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('watch-picker-theme') as Theme;
    if (savedTheme && (savedTheme === 'midnight' || savedTheme === 'champagne')) {
      setTheme(savedTheme);
      // Apply immediately to prevent flash
      document.documentElement.classList.remove('midnight', 'champagne');
      document.documentElement.classList.add(savedTheme);
    } else {
      document.documentElement.classList.add('midnight');
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      // Save to localStorage
      localStorage.setItem('watch-picker-theme', theme);
      
      // Update document class
      document.documentElement.classList.remove('midnight', 'champagne');
      document.documentElement.classList.add(theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'midnight' ? 'champagne' : 'midnight');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
