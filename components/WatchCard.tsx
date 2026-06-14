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
      whileHover={{ scale: 1.015, y: -12 }}
      whileTap={{ scale: 0.985 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25
      }}
      className="relative cursor-pointer group h-full"
      onClick={() => onSelect(watch.id)}
    >
      <div
        className={`
          relative overflow-hidden rounded-[32px] transition-all duration-700 h-full flex flex-col
          ${
            isSelected
              ? 'glass-panel-selected'
              : 'glass-panel glass-panel-hover'
          }
        `}
        style={{
          boxShadow: isSelected 
            ? '0 24px 64px 0 rgba(212, 175, 55, 0.3), 0 12px 32px 0 rgba(0, 0, 0, 0.7), inset 0 2px 0 0 rgba(248, 248, 240, 0.15), 0 0 48px 0 rgba(212, 175, 55, 0.35)'
            : '0 16px 48px 0 rgba(0, 0, 0, 0.6), 0 8px 24px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(248, 248, 240, 0.06)'
        }}
      >
        {/* Selected Indicator - Circular Badge */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: 'spring',
              stiffness: 260,
              damping: 20
            }}
            className="absolute z-10 flex items-center justify-center"
            style={{
              top: '16px',
              right: '16px',
              width: '40px',
              height: '40px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.98) 0%, rgba(212, 175, 55, 0.9) 50%, rgba(192, 168, 48, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 8px 28px 0 rgba(212, 175, 55, 0.5), 0 4px 12px 0 rgba(0, 0, 0, 0.4), inset 0 2px 0 0 rgba(248, 248, 240, 0.4), inset 0 -1px 0 0 rgba(0, 0, 0, 0.2)',
              border: '1.5px solid rgba(248, 248, 240, 0.2)',
            }}
          >
            <Check className="w-5 h-5 text-black" strokeWidth={3.5} />
            <motion.div
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.6, 0, 0.6]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gold rounded-full blur-lg pointer-events-none"
            />
          </motion.div>
        )}

        {/* Watch Image with Premium Presentation */}
        <div className="relative h-80 overflow-hidden flex items-center justify-center">
          {/* Premium backdrop */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/30" />
          
          {imageError ? (
            <div className="flex flex-col items-center justify-center text-white/40 relative z-10">
              <WatchIcon className="w-20 h-20 mb-2" strokeWidth={1} />
              <p className="text-sm">Image unavailable</p>
            </div>
          ) : (
            <motion.div 
              className="w-full h-full relative"
              whileHover={{ scale: 1.08 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20
              }}
            >
              <img
                src={watch.image}
                alt={`${watch.brand} ${watch.model}`}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
                loading="lazy"
              />
              {/* Elegant gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
            </motion.div>
          )}
        </div>

        {/* Watch Details with Refined Spacing */}
        <div className="relative p-7 bg-gradient-to-b from-black/10 to-black/30 flex-grow flex flex-col justify-between">
          {/* Brand with elegant spacing */}
          <div>
            <p className="text-gold text-xs font-semibold uppercase tracking-[0.25em] mb-3 opacity-95">
              {watch.brand}
            </p>
            <h3 className="text-white text-2xl font-bold mb-3 tracking-tight leading-tight">
              {watch.model}
            </h3>
          </div>
          
          {/* Description with better readability */}
          {watch.description && (
            <p className="text-white/60 text-sm line-clamp-2 leading-relaxed mt-auto">
              {watch.description}
            </p>
          )}
        </div>

        {/* Hover Glow Effect - More Subtle */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[32px]"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 65%)'
          }}
        />

        {/* Selected Glow - More Refined */}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 pointer-events-none rounded-[32px]"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.12) 0%, rgba(212, 175, 55, 0.04) 50%, transparent 70%)'
            }}
          />
        )}

        {/* Premium border highlight on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[32px]"
          style={{
            boxShadow: 'inset 0 0 0 1px rgba(212, 175, 55, 0.15)'
          }}
        />
      </div>

      {/* Floating shadow effect - Enhanced */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 -z-10 rounded-[32px] blur-3xl"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.15) 40%, transparent 70%)'
          }}
        />
      )}

      {/* Hover shadow lift */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.4) 0%, transparent 60%)',
          transform: 'translateY(8px)'
        }}
      />
    </motion.div>
  );
}
