'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Watch } from '@/types';
import { Check, Watch as WatchIcon } from 'lucide-react';

interface WatchCardProps {
  watch: Watch;
  isSelected: boolean;
  onSelect: (watchId: string) => void;
}

export default function WatchCard({ watch, isSelected, onSelect }: WatchCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -8 }}
      whileTap={{ scale: 0.98 }}
      className="relative cursor-pointer group"
      onClick={() => onSelect(watch.id)}
    >
      <div
        className={`
          relative overflow-hidden rounded-[28px] transition-all duration-500
          ${
            isSelected
              ? 'glass-panel-selected'
              : 'glass-panel glass-panel-hover'
          }
        `}
      >
        {/* Selected Indicator with Premium Animation */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: 'spring',
              stiffness: 260,
              damping: 20
            }}
            className="absolute top-5 right-5 z-10 glass-button rounded-full p-2.5 shadow-lg"
          >
            <Check className="w-5 h-5 text-black" strokeWidth={3} />
            <motion.div
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gold rounded-full blur-md"
            />
          </motion.div>
        )}

        {/* Watch Image with Glass Overlay */}
        <div className="relative h-72 overflow-hidden flex items-center justify-center bg-black/20">
          {imageError ? (
            <div className="flex flex-col items-center justify-center text-white/40">
              <WatchIcon className="w-20 h-20 mb-2" strokeWidth={1} />
              <p className="text-sm">Image unavailable</p>
            </div>
          ) : (
            <>
              <img
                src={watch.image}
                alt={`${watch.brand} ${watch.model}`}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
                loading="lazy"
              />
              {/* Gradient overlay for luxury effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            </>
          )}
        </div>

        {/* Watch Details with Glass Effect */}
        <div className="relative p-6 bg-gradient-to-b from-transparent to-black/20">
          <p className="text-gold text-sm font-medium uppercase tracking-[0.2em] mb-2 opacity-90">
            {watch.brand}
          </p>
          <h3 className="text-white text-xl font-semibold mb-2 tracking-tight">
            {watch.model}
          </h3>
          {watch.description && (
            <p className="text-white/50 text-sm line-clamp-2 leading-relaxed">
              {watch.description}
            </p>
          )}
        </div>

        {/* Hover Glow Effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.03) 0%, transparent 70%)'
          }}
        />

        {/* Selected Glow */}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.08) 0%, transparent 70%)'
            }}
          />
        )}
      </div>

      {/* Floating shadow effect */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 -z-10 rounded-[28px] blur-2xl bg-gold/20"
        />
      )}
    </motion.div>
  );
}
