'use client';

import { motion } from 'framer-motion';
import { WatchStats } from '@/types';
import { BarChart3 } from 'lucide-react';

interface VotesChartProps {
  stats: WatchStats[];
}

export default function VotesChart({ stats }: VotesChartProps) {
  const maxCount = Math.max(...stats.map(s => s.count), 1);

  return (
    <div className="glass-panel rounded-[24px] p-6 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="glass-panel p-2 rounded-[12px]">
            <BarChart3 className="w-5 h-5 text-gold" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Vote Distribution</h2>
        </div>
        
        <div className="space-y-6">
          {stats.map((stat, index) => (
            <div key={stat.watchId} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white font-medium">
                  {stat.brand} {stat.model}
                </span>
                <span className="text-white/50">
                  {stat.count} ({stat.percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="h-3 glass-panel rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stat.count / maxCount) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
                  className="h-full rounded-full relative"
                  style={{
                    background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.8), rgba(212, 175, 55, 0.6))'
                  }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </motion.div>
              </div>
            </div>
          ))}
          {stats.length === 0 && (
            <p className="text-white/40 text-center py-8">No data to display</p>
          )}
        </div>
      </div>
    </div>
  );
}
