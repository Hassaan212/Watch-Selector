'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ArrowRight, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onContinue: (name: string) => void;
}

export default function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const trimmedName = name.trim();
    
    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    
    if (trimmedName.length > 30) {
      setError('Name must be 30 characters or less');
      return;
    }
    
    onContinue(trimmedName);
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setName(value);
    setError('');
  }

  const isValid = name.trim().length >= 2 && name.trim().length <= 30;

  return (
    <div className="min-h-screen liquid-glass-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Light Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.02, 0.04, 0.02],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-white blur-[120px]"
        />
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="glass-panel rounded-[30px] p-10 md:p-12 shadow-2xl">
          {/* Icon with Glass Effect */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.2, 
              type: 'spring', 
              stiffness: 200,
              damping: 15
            }}
            className="inline-flex p-5 glass-panel rounded-[24px] mb-8 shadow-lg"
          >
            <div className="relative">
              <User className="w-8 h-8 text-gold" strokeWidth={1.5} />
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gold rounded-full blur-xl opacity-30"
              />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight"
          >
            Welcome
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg text-white/60 mb-10"
          >
            What should we call you?
          </motion.p>

          {/* Form */}
          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Enter your name or nickname"
                className="w-full px-5 py-4 glass-input rounded-[20px] text-white text-lg
                  focus:outline-none transition-all duration-300 placeholder:text-white/30"
                autoFocus
                maxLength={30}
              />
              
              {/* Character counter or error */}
              <div className="flex items-center justify-between mt-3 px-2">
                {error ? (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-red-400 text-sm"
                  >
                    {error}
                  </motion.p>
                ) : (
                  <p className="text-white/40 text-sm">
                    {name.length > 0 ? `${name.trim().length} / 30 characters` : 'Minimum 2 characters'}
                  </p>
                )}
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={!isValid}
              whileHover={isValid ? { scale: 1.02 } : {}}
              whileTap={isValid ? { scale: 0.98 } : {}}
              className="w-full glass-button text-black font-semibold text-lg py-4 px-8 rounded-[20px]
                disabled:opacity-40 disabled:cursor-not-allowed
                flex items-center justify-center gap-3 transition-all duration-300"
            >
              Continue to Watch Selection
              <ArrowRight className="w-5 h-5" strokeWidth={2} />
            </motion.button>
          </motion.form>

          {/* Info Badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 p-4 glass-panel rounded-[16px] border border-gold/20"
          >
            <div className="flex items-center gap-2 justify-center">
              <Sparkles className="w-4 h-4 text-gold" />
              <p className="text-gold/90 text-sm text-center">
                Your name will be shown with your selections
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
