'use client';

import { motion } from 'framer-motion';
import { Watch } from '@/types';
import { Check } from 'lucide-react';

interface WatchCardProps {
  watch: Watch;
  isSelected: boolean;
  onSelect: (watchId: string) => void;
}

export default function WatchCard({ watch, isSelected, onSelect }: WatchCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="relative cursor-pointer"
      onClick={() => onSelect(watch.id)}
    >
      <div
        className={`
          relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800
          border-2 transition-all duration-300
          ${
            isSelected
              ? 'border-amber-500 shadow-2xl shadow-amber-500/30'
              : 'border-zinc-700 hover:border-zinc-600'
          }
        `}
      >
        {/* Selected Indicator */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 right-4 z-10 bg-amber-500 text-black rounded-full p-2"
          >
            <Check className="w-6 h-6" />
          </motion.div>
        )}

        {/* Watch Image */}
        <div className="relative h-72 bg-zinc-950 overflow-hidden">
          <img
            src={watch.image}
            alt={`${watch.brand} ${watch.model}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
        </div>

        {/* Watch Details */}
        <div className="p-6">
          <p className="text-amber-500 text-sm font-medium uppercase tracking-wider mb-1">
            {watch.brand}
          </p>
          <h3 className="text-white text-xl font-semibold mb-2">
            {watch.model}
          </h3>
          {watch.description && (
            <p className="text-zinc-400 text-sm line-clamp-2">
              {watch.description}
            </p>
          )}
        </div>

        {/* Glow Effect */}
        {isSelected && (
          <div className="absolute inset-0 bg-amber-500/5 pointer-events-none" />
        )}
      </div>
    </motion.div>
  );
}
