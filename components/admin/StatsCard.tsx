'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  color?: 'amber' | 'blue' | 'green';
}

export default function StatsCard({ icon, label, value, color = 'amber' }: StatsCardProps) {
  const colorClasses = {
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    green: 'bg-green-500/10 text-green-500 border-green-500/20',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
    >
      <div className={`inline-flex p-3 rounded-lg mb-4 ${colorClasses[color]}`}>
        {icon}
      </div>
      <p className="text-zinc-400 text-sm mb-1">{label}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
    </motion.div>
  );
}
