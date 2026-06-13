'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Watch } from '@/types';
import { getWatches, submitVote } from '@/lib/watches';
import { getSessionId, hasSubmitted, markAsSubmitted } from '@/lib/sessionId';
import WatchCard from '@/components/WatchCard';
import SuccessScreen from '@/components/SuccessScreen';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function Home() {
  const [watches, setWatches] = useState<Watch[]>([]);
  const [selectedWatchIds, setSelectedWatchIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has already submitted
    if (hasSubmitted()) {
      setHasVoted(true);
      setLoading(false);
      return;
    }

    // Load watches
    loadWatches();
  }, []);

  async function loadWatches() {
    const watchesData = await getWatches();
    setWatches(watchesData);
    setLoading(false);
  }

  function handleWatchSelect(watchId: string) {
    setSelectedWatchIds(prev => {
      // If already selected, remove it
      if (prev.includes(watchId)) {
        return prev.filter(id => id !== watchId);
      }
      // If less than 3 selected, add it
      if (prev.length < 3) {
        return [...prev, watchId];
      }
      // If already 3 selected, don't add more
      return prev;
    });
  }

  async function handleSubmit() {
    if (selectedWatchIds.length !== 3 || isSubmitting) return;

    const selectedWatches = watches.filter(w => selectedWatchIds.includes(w.id));
    if (selectedWatches.length !== 3) return;

    setIsSubmitting(true);

    try {
      const sessionId = getSessionId();
      await submitVote(
        selectedWatches.map(w => ({
          id: w.id,
          brand: w.brand,
          model: w.model,
        })),
        sessionId
      );
      
      markAsSubmitted();
      setHasVoted(true);
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Failed to submit vote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (hasVoted) {
    return <SuccessScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-12 pb-8 px-4"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
             Pick Your Favorite Luxury Watches ✨
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 mb-4">
            Which 3 watches would you like to wear?
          </p>
          {/* Selection Counter */}
          {selectedWatchIds.length > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-block px-6 py-3 bg-amber-500/10 border border-amber-500/30 rounded-full"
            >
              <p className="text-amber-500 font-semibold">
                Selected {selectedWatchIds.length}/3
              </p>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Watches Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-32">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {watches.map((watch, index) => (
            <motion.div
              key={watch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <WatchCard
                watch={watch}
                isSelected={selectedWatchIds.includes(watch.id)}
                onSelect={handleWatchSelect}
              />
            </motion.div>
          ))}
        </motion.div>

        {watches.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-400 text-lg">No watches available yet.</p>
          </div>
        )}
      </main>

      {/* Submit Button */}
      <AnimatePresence>
        {selectedWatchIds.length === 3 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent"
          >
            <div className="max-w-md mx-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold text-lg py-4 px-8 rounded-full
                  shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit My Choices
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
