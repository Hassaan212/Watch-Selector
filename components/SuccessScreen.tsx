'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function SuccessScreen() {
  return (
    <div className="min-h-screen liquid-glass-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Theme Toggle - Top Right */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="fixed top-8 right-8 z-50"
      >
        <ThemeToggle />
      </motion.div>

      {/* Luxury Ambient Lighting - Celebratory Gold Radiance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.10, 0.16, 0.10],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full blur-[240px]"
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.12) 35%, transparent 60%)'
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.06, 0.10, 0.06],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-[25%] right-[15%] w-[600px] h-[600px] rounded-full blur-[160px]"
          style={{
            background: 'radial-gradient(circle, rgba(192, 192, 192, 0.15) 0%, rgba(192, 192, 192, 0.06) 45%, transparent 70%)'
          }}
        />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="text-center relative z-10"
      >
        {/* Success Icon with Glass Panel */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.2,
            type: 'spring',
            stiffness: 200,
            damping: 15
          }}
          className="inline-block mb-10"
        >
          <div className="glass-panel p-8 rounded-[32px] relative">
            <CheckCircle className="w-24 h-24 text-gold" strokeWidth={1.5} />
            {/* Pulsing glow effect */}
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gold rounded-[32px] blur-2xl -z-10"
            />
          </div>
        </motion.div>

        {/* Main Content Glass Panel */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="glass-panel rounded-[30px] p-10 md:p-12 max-w-2xl mx-auto"
        >
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            Thank you!
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-xl md:text-2xl text-white/60 mb-10"
          >
            Your selections have been recorded successfully
          </motion.p>

          {/* Decorative Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="inline-block glass-panel px-8 py-4 rounded-[24px] border border-gold/20"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-gold" />
              <p className="text-gold text-base">
                Thank you for participating and sharing your favorite
              </p>
              <Sparkles className="w-5 h-5 text-gold" />
            </div>
          </motion.div>
        </motion.div>

        {/* Floating particles effect */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gold rounded-full"
            initial={{ 
              x: 0, 
              y: 0,
              opacity: 0 
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 200],
              y: [0, -100 - Math.random() * 100],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: 0.8 + i * 0.1,
              ease: "easeOut"
            }}
            style={{
              left: '50%',
              top: '40%',
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
