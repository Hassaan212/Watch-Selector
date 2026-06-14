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
        return <Crown className="w-6 h-6 text-amber-500" />;
      case 2:
        return <Trophy className="w-6 h-6 text-zinc-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-700" />;
      default:
        return (
          <div className="w-6 h-6 flex items-center justify-center text-zinc-500 font-bold">
            {rank}
          </div>
        );
    }
  };

  // Filter only watches with votes
  const rankedStats = stats.filter(stat => stat.count > 0);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Crown className="w-6 h-6 text-amber-500" />
        <h2 className="text-xl font-bold text-white">Best of Best Rankings</h2>
      </div>
      <p className="text-zinc-400 text-sm mb-6">
        Final round winners - the ultimate favorites
      </p>
      <div className="space-y-3">
        {rankedStats.map((stat, index) => (
          <motion.div
            key={stat.watchId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center gap-4 rounded-lg p-4 border ${
              stat.rank === 1
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-zinc-950 border-zinc-800'
            }`}
          >
            <div className="flex-shrink-0">{getRankIcon(stat.rank)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold">{stat.brand}</p>
              <p className="text-zinc-400 text-sm truncate">{stat.model}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-white font-bold">{stat.count} {stat.count === 1 ? 'vote' : 'votes'}</p>
              <p className="text-zinc-400 text-sm">{stat.percentage.toFixed(1)}%</p>
            </div>
          </motion.div>
        ))}
        {rankedStats.length === 0 && (
          <p className="text-zinc-400 text-center py-8">No final round winners yet</p>
        )}
      </div>
    </div>
  );
}
