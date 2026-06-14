'use client';

import { motion } from 'framer-motion';
import { WatchStats } from '@/types';
import { Trophy, Medal, Award } from 'lucide-react';

interface RankingsListProps {
  stats: WatchStats[];
}

export default function RankingsList({ stats }: RankingsListProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-gold" strokeWidth={1.5} />;
      case 2:
        return <Medal className="w-6 h-6 text-white/60" strokeWidth={1.5} />;
      case 3:
        return <Award className="w-6 h-6 text-gold/60" strokeWidth={1.5} />;
      default:
        return (
          <div className="w-6 h-6 flex items-center justify-center text-white/40 font-bold text-sm">
            {rank}
          </div>
        );
    }
  };

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
      <div className="absolute top-0 left-0 w-72 h-72 bg-gold/[0.03] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-white mb-7 tracking-tight">Rankings</h2>
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.watchId}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: 'spring',
                stiffness: 250,
                damping: 28,
                delay: index * 0.04,
                mass: 0.8
              }}
              whileHover={{
                x: 4,
                scale: 1.012,
                transition: {
                  type: 'spring',
                  stiffness: 400,
                  damping: 25
                }
              }}
              className="flex items-center gap-4 glass-panel rounded-[20px] p-5 group cursor-pointer"
              style={{
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(248, 248, 240, 0.06)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {/* Hover state enhancements */}
              <style jsx>{`
                .glass-panel:hover {
                  background: linear-gradient(135deg, rgba(255, 255, 255, 0.055) 0%, rgba(255, 255, 255, 0.03) 100%) !important;
                  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4), 
                              0 0 0 1px rgba(212, 175, 55, 0.15),
                              inset 0 1px 0 rgba(248, 248, 240, 0.08) !important;
                }
              `}</style>

              <motion.div
                className="flex-shrink-0"
                whileHover={{
                  scale: 1.08,
                  transition: {
                    type: 'spring',
                    stiffness: 400,
                    damping: 20
                  }
                }}
              >
                {getRankIcon(stat.rank)}
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-base group-hover:text-white transition-colors duration-200">
                  {stat.brand}
                </p>
                <p className="text-white/50 text-sm truncate group-hover:text-white/60 transition-colors duration-200">
                  {stat.model}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-white font-bold text-base group-hover:text-white transition-colors duration-200">
                  {stat.count} votes
                </p>
                <p className="text-white/50 text-sm group-hover:text-white/60 transition-colors duration-200">
                  {stat.percentage.toFixed(1)}%
                </p>
              </div>
            </motion.div>
          ))}
          {stats.length === 0 && (
            <p className="text-white/40 text-center py-12">No votes yet</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
