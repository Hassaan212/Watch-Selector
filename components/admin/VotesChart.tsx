'use client';

import { motion } from 'framer-motion';
import { WatchStats } from '@/types';

interface VotesChartProps {
  stats: WatchStats[];
}

export default function VotesChart({ stats }: VotesChartProps) {
  const maxCount = Math.max(...stats.map(s => s.count), 1);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Vote Distribution</h2>
      <div className="space-y-6">
        {stats.map((stat, index) => (
          <div key={stat.watchId} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white font-medium">
                {stat.brand} {stat.model}
              </span>
              <span className="text-zinc-400">
                {stat.count} ({stat.percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="h-3 bg-zinc-950 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stat.count / maxCount) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-amber-600 to-amber-500 rounded-full"
              />
            </div>
          </div>
        ))}
        {stats.length === 0 && (
          <p className="text-zinc-400 text-center py-8">No data to display</p>
        )}
      </div>
    </div>
  );
}
