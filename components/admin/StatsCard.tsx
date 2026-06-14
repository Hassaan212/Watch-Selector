'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  color?: 'gold' | 'blue' | 'green';
}

export default function StatsCard({ icon, label, value, color = 'gold' }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 25,
        mass: 0.8
      }}
      whileHover={{
        y: -3,
        scale: 1.015,
        transition: {
          duration: 0.15,
          ease: [0.25, 0.1, 0.25, 1]
        }
      }}
      className="glass-panel rounded-[28px] p-7 relative overflow-hidden group cursor-pointer"
      style={{
        boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(248, 248, 240, 0.08)',
        transition: 'box-shadow 0.15s ease-out, background 0.15s ease-out'
      }}
    >
      {/* Hover state enhancements */}
      <style jsx>{`
        .glass-panel:hover {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.055) 0%, rgba(255, 255, 255, 0.03) 100%) !important;
          box-shadow: 0 16px 48px 0 rgba(0, 0, 0, 0.6), 
                      0 0 0 1px rgba(212, 175, 55, 0.2),
                      inset 0 1px 0 0 rgba(248, 248, 240, 0.12) !important;
        }
      `}</style>

      {/* Refined hover glow */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none rounded-[28px]"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.06) 0%, transparent 70%)'
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      />

      <div className="relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
            delay: 0.1
          }}
          whileHover={{
            scale: 1.05,
            transition: {
              duration: 0.12,
              ease: [0.25, 0.1, 0.25, 1]
            }
          }}
          className="inline-flex p-3.5 glass-panel rounded-[18px] mb-5"
          style={{
            boxShadow: 'inset 0 1px 0 0 rgba(248, 248, 240, 0.1), 0 4px 12px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(212, 175, 55, 0.15)'
          }}
        >
          <div className="text-gold">
            {icon}
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-white/60 text-sm mb-3 font-medium group-hover:text-white/75"
          style={{ transition: 'color 0.15s ease-out' }}
        >
          {label}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 150,
            damping: 20,
            delay: 0.2
          }}
          className="text-white text-3xl font-bold tracking-tight group-hover:text-white"
          style={{ transition: 'color 0.15s ease-out' }}
        >
          {value}
        </motion.p>
      </div>
    </motion.div>
  );
}
