'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12 shadow-2xl">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block p-4 bg-amber-500/10 rounded-full mb-6"
          >
            <User className="w-8 h-8 text-amber-500" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-white mb-3"
          >
            Welcome! 👋
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-zinc-400 mb-8"
          >
            What should we call you?
          </motion.p>

          {/* Form */}
          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Enter your name or nickname"
                className="w-full px-4 py-4 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-lg
                  focus:outline-none focus:border-amber-500 transition-colors placeholder:text-zinc-600"
                autoFocus
                maxLength={30}
              />
              
              {/* Character counter */}
              <div className="flex items-center justify-between mt-2 px-1">
                {error ? (
                  <p className="text-red-500 text-sm">{error}</p>
                ) : (
                  <p className="text-zinc-600 text-sm">
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
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold text-lg py-4 px-8 rounded-lg
                shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                flex items-center justify-center gap-3"
            >
              Continue to Watch Selection
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </motion.form>

          {/* Info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg"
          >
            <p className="text-amber-500/80 text-sm text-center">
              Your name will be shown with your selections
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
