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
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="glass-panel glass-panel-hover rounded-[24px] p-6 relative overflow-hidden group"
    >
      {/* Ambient glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent" />
      </div>

      <div className="relative z-10">
        <div className="inline-flex p-3 glass-panel rounded-[16px] mb-4 border border-gold/20">
          <div className="text-gold">
            {icon}
          </div>
        </div>
        <p className="text-white/60 text-sm mb-2">{label}</p>
        <p className="text-white text-3xl font-bold tracking-tight">{value}</p>
      </div>
    </motion.div>
  );
}
