'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Watch } from '@/types';
import { getWatches, submitVote } from '@/lib/watches';
import { getSessionId, hasSubmitted, markAsSubmitted } from '@/lib/sessionId';
import WatchCard from '@/components/WatchCard';
import WelcomeScreen from '@/components/WelcomeScreen';
import SuccessScreen from '@/components/SuccessScreen';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowRight, Loader2, Trophy, Sparkles, Check } from 'lucide-react';

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
      <div className="min-h-screen liquid-glass-bg flex items-center justify-center relative overflow-hidden">
        {/* Theme Toggle - Top Right */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="fixed top-8 right-8 z-50"
        >
          <ThemeToggle />
        </motion.div>

        {/* Ambient loading glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.06, 0.12, 0.06],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-[800px] h-[800px] rounded-full blur-[200px]"
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.05) 50%, transparent 70%)'
          }}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20
          }}
          className="relative z-10"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-12 h-12 text-gold" strokeWidth={1.5} />
          </motion.div>
        </motion.div>
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
      <div className="min-h-screen liquid-glass-bg relative overflow-hidden">
        {/* Theme Toggle - Top Right */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="fixed top-8 right-8 z-50"
        >
          <ThemeToggle />
        </motion.div>

        {/* Luxury Ambient Lighting - Champagne & Emerald Accents */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.06, 0.10, 0.06],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-[-10%] left-[15%] w-[900px] h-[900px] rounded-full blur-[200px]"
            style={{
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 40%, transparent 70%)'
            }}
          />
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.04, 0.08, 0.04],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
            className="absolute bottom-[-15%] right-[10%] w-[1000px] h-[800px] rounded-full blur-[180px]"
            style={{
              background: 'radial-gradient(ellipse, rgba(192, 192, 192, 0.08) 0%, rgba(192, 192, 192, 0.03) 40%, transparent 70%)'
            }}
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.03, 0.06, 0.03],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 6
            }}
            className="absolute top-[40%] right-[5%] w-[600px] h-[600px] rounded-full blur-[150px]"
            style={{
              background: 'radial-gradient(circle, rgba(45, 90, 74, 0.12) 0%, rgba(45, 90, 74, 0.04) 50%, transparent 70%)'
            }}
          />
        </div>

        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="pt-16 pb-12 px-4 relative z-10"
        >
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <Sparkles className="w-6 h-6 text-gold" strokeWidth={1.5} />
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              Help me settle a debate
            </h1>
            <p className="text-xl md:text-2xl text-white/60 mb-6">
              Select your 5 favorite luxury watches
            </p>
            
            {/* Premium Selection Counter */}
            {selectedWatchIds.length > 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 20
                }}
                className="inline-block relative"
              >
                <div 
                  className="glass-panel px-10 py-5 rounded-[28px] border-2 relative overflow-hidden"
                  style={{
                    borderColor: 'rgba(212, 175, 55, 0.4)',
                    boxShadow: '0 16px 48px 0 rgba(0, 0, 0, 0.6), 0 8px 24px 0 rgba(212, 175, 55, 0.2), inset 0 2px 0 0 rgba(248, 248, 240, 0.1)',
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)'
                  }}
                >
                  {/* Subtle shimmer effect */}
                  <motion.div
                    animate={{
                      x: ['-200%', '200%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                      repeatDelay: 1
                    }}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.1) 50%, transparent 100%)',
                      width: '50%'
                    }}
                  />
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: i * 0.05,
                            type: 'spring',
                            stiffness: 300,
                            damping: 20
                          }}
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            background: i < selectedWatchIds.length 
                              ? 'linear-gradient(135deg, rgba(212, 175, 55, 1) 0%, rgba(192, 168, 48, 1) 100%)'
                              : 'rgba(255, 255, 255, 0.15)',
                            boxShadow: i < selectedWatchIds.length 
                              ? '0 0 12px rgba(212, 175, 55, 0.6), inset 0 1px 0 rgba(248, 248, 240, 0.3)'
                              : 'inset 0 1px 2px rgba(0, 0, 0, 0.3)'
                          }}
                        />
                      ))}
                    </div>
                    
                    <div className="h-6 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
                    
                    <p className="text-gold font-bold text-xl tracking-tight">
                      {selectedWatchIds.length}<span className="text-white/40 font-normal text-base ml-1">/5</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.header>

        {/* Premium Watches Grid */}
        <main className="max-w-7xl mx-auto px-4 pb-40 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {watches.map((watch, index) => (
              <motion.div
                key={watch.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.1 * index,
                  duration: 0.7,
                  ease: [0.4, 0, 0.2, 1]
                }}
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
              <p className="text-white/40 text-lg">No watches available yet.</p>
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
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="fixed bottom-0 left-0 right-0 p-6 z-20"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 80%, transparent 100%)'
              }}
            >
              <div className="max-w-md mx-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={proceedToRound2}
                  className="w-full glass-button text-black font-bold text-lg py-5 px-8 rounded-[24px]
                    flex items-center justify-center gap-3 shadow-2xl"
                >
                  Continue to Final Round
                  <ArrowRight className="w-6 h-6" strokeWidth={2.5} />
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
    <div className="min-h-screen liquid-glass-bg relative overflow-hidden">
      {/* Theme Toggle - Top Right */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="fixed top-8 right-8 z-50"
      >
        <ThemeToggle />
      </motion.div>

      {/* Luxury Ambient Lighting - Premium Gold Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.08, 0.14, 0.08],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] rounded-full blur-[220px]"
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.08) 35%, transparent 65%)'
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.04, 0.08, 0.04],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute bottom-[10%] left-[20%] w-[700px] h-[700px] rounded-full blur-[180px]"
          style={{
            background: 'radial-gradient(circle, rgba(30, 58, 95, 0.12) 0%, rgba(30, 58, 95, 0.04) 50%, transparent 70%)'
          }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="pt-16 pb-12 px-4 relative z-10"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.2,
              type: 'spring',
              stiffness: 200,
              damping: 15
            }}
            className="inline-block mb-6"
          >
            <div className="glass-panel p-6 rounded-[28px]">
              <Trophy className="w-16 h-16 text-gold" strokeWidth={1.5} />
            </div>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            Best of Best
          </h1>
          <p className="text-xl md:text-2xl text-white/60 mb-6">
            Now choose your ultimate favorite from your top 5
          </p>
          
          {finalWinnerId && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20
              }}
              className="inline-block relative"
            >
              <div 
                className="glass-panel px-10 py-5 rounded-[28px] border-2 relative overflow-hidden"
                style={{
                  borderColor: 'rgba(212, 175, 55, 0.5)',
                  boxShadow: '0 16px 48px 0 rgba(0, 0, 0, 0.6), 0 8px 24px 0 rgba(212, 175, 55, 0.25), inset 0 2px 0 0 rgba(248, 248, 240, 0.12)',
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
                }}
              >
                {/* Shimmer effect */}
                <motion.div
                  animate={{
                    x: ['-200%', '200%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1
                  }}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.15) 50%, transparent 100%)',
                    width: '50%'
                  }}
                />
                
                <div className="flex items-center gap-4 relative z-10">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Check 
                      className="w-6 h-6 text-gold" 
                      strokeWidth={3}
                      style={{
                        filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.6))'
                      }}
                    />
                  </motion.div>
                  
                  <div className="h-6 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
                  
                  <p className="text-gold font-bold text-lg tracking-tight">
                    Ultimate Favorite Selected
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Premium Selected Watches Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-40 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {selectedWatches.map((watch, index) => (
            <motion.div
              key={watch.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.1 * index,
                duration: 0.7,
                ease: [0.4, 0, 0.2, 1]
              }}
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
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="fixed bottom-0 left-0 right-0 p-6 z-20"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 80%, transparent 100%)'
            }}
          >
            <div className="max-w-md mx-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="w-full glass-button text-black font-bold text-lg py-5 px-8 rounded-[24px]
                  disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-2xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" strokeWidth={2.5} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Trophy className="w-6 h-6" strokeWidth={2.5} />
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
