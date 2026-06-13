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
        return <Trophy className="w-6 h-6 text-amber-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-zinc-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-700" />;
      default:
        return (
          <div className="w-6 h-6 flex items-center justify-center text-zinc-500 font-bold">
            {rank}
          </div>
        );
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Rankings</h2>
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.watchId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-4 bg-zinc-950 rounded-lg p-4 border border-zinc-800"
          >
            <div className="flex-shrink-0">{getRankIcon(stat.rank)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold">{stat.brand}</p>
              <p className="text-zinc-400 text-sm truncate">{stat.model}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-white font-bold">{stat.count} votes</p>
              <p className="text-zinc-400 text-sm">{stat.percentage.toFixed(1)}%</p>
            </div>
          </motion.div>
        ))}
        {stats.length === 0 && (
          <p className="text-zinc-400 text-center py-8">No votes yet</p>
        )}
      </div>
    </div>
  );
}
