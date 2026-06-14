'use client';

import { motion } from 'framer-motion';
import { WatchStats } from '@/types';
import { Trophy, Medal, Award, Crown } from 'lucide-react';

interface BestOfBestRankingsProps {
  stats: WatchStats[];
}

export default function BestOfBestRankings({ stats }: BestOfBestRankingsProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-gold" strokeWidth={1.5} />;
      case 2:
        return <Trophy className="w-6 h-6 text-white/60" strokeWidth={1.5} />;
      case 3:
        return <Medal className="w-6 h-6 text-gold/60" strokeWidth={1.5} />;
      default:
        return (
          <div className="w-6 h-6 flex items-center justify-center text-white/40 font-bold text-sm">
            {rank}
          </div>
        );
    }
  };

  // Filter only watches with votes
  const rankedStats = stats.filter(stat => stat.count > 0);

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
      <div className="absolute top-0 right-0 w-72 h-72 bg-gold/[0.04] rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
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
          className="flex items-center gap-3 mb-5"
        >
          <div 
            className="glass-panel p-2.5 rounded-[16px]"
            style={{
              boxShadow: 'inset 0 1px 0 rgba(248, 248, 240, 0.1), 0 4px 12px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(212, 175, 55, 0.15)'
            }}
          >
            <Crown className="w-5 h-5 text-gold" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Best of Best Rankings</h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/50 text-sm mb-7"
        >
          Final round winners - the ultimate favorites
        </motion.p>
        <div className="space-y-3">
          {rankedStats.map((stat, index) => (
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
              className={`flex items-center gap-4 rounded-[20px] p-5 group cursor-pointer ${
                stat.rank === 1
                  ? 'glass-panel-selected'
                  : 'glass-panel'
              }`}
              style={{
                boxShadow: stat.rank === 1
                  ? '0 8px 28px 0 rgba(212, 175, 55, 0.25), inset 0 2px 0 rgba(248, 248, 240, 0.12)'
                  : '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(248, 248, 240, 0.06)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {/* Hover state enhancements for non-first ranks */}
              {stat.rank !== 1 && (
                <style jsx>{`
                  .glass-panel:hover {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.055) 0%, rgba(255, 255, 255, 0.03) 100%) !important;
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4), 
                                0 0 0 1px rgba(212, 175, 55, 0.15),
                                inset 0 1px 0 rgba(248, 248, 240, 0.08) !important;
                  }
                `}</style>
              )}

              <motion.div
                className="flex-shrink-0"
                whileHover={{
                  scale: 1.08,
                  rotate: stat.rank === 1 ? 5 : 0,
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
                <p className={`text-sm truncate ${stat.rank === 1 ? 'text-gold/80 group-hover:text-gold' : 'text-white/50 group-hover:text-white/60'} transition-colors duration-200`}>
                  {stat.model}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-white font-bold text-base group-hover:text-white transition-colors duration-200">
                  {stat.count} {stat.count === 1 ? 'vote' : 'votes'}
                </p>
                <p className={`text-sm ${stat.rank === 1 ? 'text-gold/70 group-hover:text-gold/85' : 'text-white/50 group-hover:text-white/60'} transition-colors duration-200`}>
                  {stat.percentage.toFixed(1)}%
                </p>
              </div>
            </motion.div>
          ))}
          {rankedStats.length === 0 && (
            <p className="text-white/40 text-center py-12">No final round winners yet</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
