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
    <div className="glass-panel rounded-[24px] p-6 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/8 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="glass-panel p-2 rounded-[12px]">
            <Crown className="w-5 h-5 text-gold" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Best of Best Rankings</h2>
        </div>
        <p className="text-white/50 text-sm mb-6">
          Final round winners - the ultimate favorites
        </p>
        <div className="space-y-3">
          {rankedStats.map((stat, index) => (
            <motion.div
              key={stat.watchId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 4 }}
              className={`flex items-center gap-4 rounded-[16px] p-4 transition-all duration-300 ${
                stat.rank === 1
                  ? 'glass-panel-selected'
                  : 'glass-panel glass-panel-hover'
              }`}
            >
              <div className="flex-shrink-0">{getRankIcon(stat.rank)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold">{stat.brand}</p>
                <p className={`text-sm truncate ${stat.rank === 1 ? 'text-gold/80' : 'text-white/50'}`}>
                  {stat.model}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-white font-bold">{stat.count} {stat.count === 1 ? 'vote' : 'votes'}</p>
                <p className={`text-sm ${stat.rank === 1 ? 'text-gold/70' : 'text-white/50'}`}>
                  {stat.percentage.toFixed(1)}%
                </p>
              </div>
            </motion.div>
          ))}
          {rankedStats.length === 0 && (
            <p className="text-white/40 text-center py-8">No final round winners yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
