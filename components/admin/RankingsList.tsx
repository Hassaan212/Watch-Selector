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
    <div className="glass-panel rounded-[24px] p-6 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      
      <div className="relative z-10">
        <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Rankings</h2>
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.watchId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 4 }}
              className="flex items-center gap-4 glass-panel glass-panel-hover rounded-[16px] p-4"
            >
              <div className="flex-shrink-0">{getRankIcon(stat.rank)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold">{stat.brand}</p>
                <p className="text-white/50 text-sm truncate">{stat.model}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-white font-bold">{stat.count} votes</p>
                <p className="text-white/50 text-sm">{stat.percentage.toFixed(1)}%</p>
              </div>
            </motion.div>
          ))}
          {stats.length === 0 && (
            <p className="text-white/40 text-center py-8">No votes yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
