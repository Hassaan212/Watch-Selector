'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Watch } from '@/types';
import { getWatches, submitVote } from '@/lib/watches';
import { getSessionId, hasSubmitted, markAsSubmitted } from '@/lib/sessionId';
import WatchCard from '@/components/WatchCard';
import WelcomeScreen from '@/components/WelcomeScreen';
import SuccessScreen from '@/components/SuccessScreen';
import { ArrowRight, Loader2, Trophy } from 'lucide-react';

type VotingStage = 'welcome' | 'round1' | 'round2' | 'success';

export default function Home() {
  const [watches, setWatches] = useState<Watch[]>([]);
  const [stage, setStage] = useState<VotingStage>('welcome');
  
  // Participant name
  const [participantName, setParticipantName] = useState<string>('');
  
  // Round 1: Select 5 watches
  const [selectedWatchIds, setSelectedWatchIds] = useState<string[]>([]);
  
  // Round 2: Select 1 ultimate favorite from the 5
  const [finalWinnerId, setFinalWinnerId] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has already submitted
    if (hasSubmitted()) {
      setStage('success');
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

  // Handle welcome screen completion
  function handleWelcomeContinue(name: string) {
    setParticipantName(name);
    setStage('round1');
  }

  // Round 1: Handle watch selection (max 5)
  function handleRound1Selection(watchId: string) {
    setSelectedWatchIds(prev => {
      // If already selected, remove it
      if (prev.includes(watchId)) {
        return prev.filter(id => id !== watchId);
      }
      // If less than 5 selected, add it
      if (prev.length < 5) {
        return [...prev, watchId];
      }
      // If already 5 selected, don't add more
      return prev;
    });
  }

  // Round 1: Proceed to Round 2
  function proceedToRound2() {
    if (selectedWatchIds.length === 5) {
      setStage('round2');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Round 2: Handle final winner selection
  function handleRound2Selection(watchId: string) {
    setFinalWinnerId(watchId);
  }

  // Round 2: Submit final vote
  async function handleFinalSubmit() {
    if (!finalWinnerId || selectedWatchIds.length !== 5 || isSubmitting || !participantName) return;

    const selectedWatches = watches.filter(w => selectedWatchIds.includes(w.id));
    const winner = watches.find(w => w.id === finalWinnerId);
    
    if (selectedWatches.length !== 5 || !winner) return;

    setIsSubmitting(true);

    try {
      const sessionId = getSessionId();
      await submitVote(
        selectedWatches.map(w => ({
          id: w.id,
          brand: w.brand,
          model: w.model,
        })),
        {
          id: winner.id,
          brand: winner.brand,
          model: winner.model,
        },
        sessionId,
        participantName
      );
      
      markAsSubmitted();
      setStage('success');
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

  if (stage === 'success') {
    return <SuccessScreen />;
  }

  if (stage === 'welcome') {
    return <WelcomeScreen onContinue={handleWelcomeContinue} />;
  }

  // Round 1: Select 5 watches
  if (stage === 'round1') {
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
              Help me settle a debate 😄
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 mb-4">
              Select your 5 favorite luxury watches
            </p>
            {/* Selection Counter */}
            {selectedWatchIds.length > 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-block px-6 py-3 bg-amber-500/10 border border-amber-500/30 rounded-full"
              >
                <p className="text-amber-500 font-semibold">
                  Selected {selectedWatchIds.length}/5
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
                  onSelect={handleRound1Selection}
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

        {/* Submit Button for Round 1 */}
        <AnimatePresence>
          {selectedWatchIds.length === 5 && (
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
                  onClick={proceedToRound2}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold text-lg py-4 px-8 rounded-full
                    shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300
                    flex items-center justify-center gap-3"
                >
                  Continue to Final Round
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Round 2: Select 1 ultimate favorite from the 5
  const selectedWatches = watches.filter(w => selectedWatchIds.includes(w.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-12 pb-8 px-4"
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block mb-4">
            <Trophy className="w-16 h-16 text-amber-500 mx-auto" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Best of Best
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 mb-4">
            Now choose your ultimate favorite from your top 5
          </p>
          {finalWinnerId && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-block px-6 py-3 bg-amber-500/10 border border-amber-500/30 rounded-full"
            >
              <p className="text-amber-500 font-semibold">
                ✓ Ultimate Favorite Selected
              </p>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Selected 5 Watches Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-32">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {selectedWatches.map((watch, index) => (
            <motion.div
              key={watch.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <WatchCard
                watch={watch}
                isSelected={finalWinnerId === watch.id}
                onSelect={handleRound2Selection}
              />
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Submit Button for Round 2 */}
      <AnimatePresence>
        {finalWinnerId && (
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
                onClick={handleFinalSubmit}
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
                    <Trophy className="w-6 h-6" />
                    Submit Final Choice
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
