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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 180,
        damping: 25
      }}
      className="glass-panel rounded-[28px] p-7 relative overflow-hidden"
      style={{
        boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(248, 248, 240, 0.08)',
      }}
    >
      {/* Subtle background glow */}
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gold/[0.03] rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
      
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
            delay: 0.1
          }}
          className="flex items-center gap-3 mb-7"
        >
          <div 
            className="glass-panel p-2.5 rounded-[16px]"
            style={{
              boxShadow: 'inset 0 1px 0 rgba(248, 248, 240, 0.1), 0 4px 12px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(212, 175, 55, 0.15)'
            }}
          >
            <BarChart3 className="w-5 h-5 text-gold" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Vote Distribution</h2>
        </motion.div>
        
        <div className="space-y-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.watchId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 25,
                delay: index * 0.06,
                mass: 0.8
              }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-white font-medium">
                  {stat.brand} {stat.model}
                </span>
                <span className="text-white/50">
                  {stat.count} ({stat.percentage.toFixed(1)}%)
                </span>
              </div>
              <div 
                className="h-3.5 glass-panel rounded-full overflow-hidden relative"
                style={{
                  boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.4)',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stat.count / maxCount) * 100}%` }}
                  transition={{
                    type: 'spring',
                    stiffness: 120,
                    damping: 20,
                    delay: index * 0.08 + 0.2,
                    mass: 1
                  }}
                  className="h-full rounded-full relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.9) 0%, rgba(212, 175, 55, 0.7) 100%)',
                    boxShadow: '0 0 12px rgba(212, 175, 55, 0.4), inset 0 1px 0 rgba(248, 248, 240, 0.3)'
                  }}
                >
                  {/* Subtle shine effect */}
                  <motion.div
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 2,
                      delay: index * 0.08 + 1,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                    style={{ width: '50%' }}
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
          {stats.length === 0 && (
            <p className="text-white/40 text-center py-12">No data to display</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
