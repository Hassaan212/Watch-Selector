'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Submission } from '@/types';
import { User, Trophy, Calendar, ChevronDown, ChevronUp, List } from 'lucide-react';

interface RecentParticipantsProps {
  submissions: Submission[];
}

export default function RecentParticipants({ submissions }: RecentParticipantsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Only show submissions with participantName
  const participantsWithNames = submissions.filter(sub => sub.participantName);

  if (participantsWithNames.length === 0) {
    return (
      <div className="glass-panel rounded-[24px] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="glass-panel p-2 rounded-[12px]">
            <User className="w-5 h-5 text-gold" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Recent Participants</h2>
        </div>
        <p className="text-white/40 text-center py-8">No participants with names yet</p>
      </div>
    );
  }

  function toggleExpand(id: string) {
    setExpandedId(expandedId === id ? null : id);
  }

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  function formatDateTime(date: Date) {
    return new Date(date).toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  return (
    <div className="glass-panel rounded-[24px] p-6 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="glass-panel p-2 rounded-[12px]">
            <User className="w-5 h-5 text-gold" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Recent Participants</h2>
          <span className="text-sm text-white/50">({participantsWithNames.length})</span>
        </div>

        <div className="space-y-3">
          {participantsWithNames.map((submission, index) => {
            const isExpanded = expandedId === submission.id;
            const selectedCount = submission.selectedWatches?.length || 0;

            return (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-panel glass-panel-hover rounded-[20px] overflow-hidden"
              >
                {/* Main Card */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Participant Info */}
                    <div className="flex-1 min-w-0">
                      {/* Name */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 glass-panel rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-gold" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-white font-semibold truncate">
                          {submission.participantName}
                        </h3>
                      </div>

                      {/* Info Grid */}
                      <div className="ml-10 space-y-2">
                        {/* Date */}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-white/40" strokeWidth={1.5} />
                          <p className="text-xs text-white/50">
                            {formatDate(submission.timestamp)}
                          </p>
                        </div>

                        {/* Best of Best Winner */}
                        {submission.finalWinner && (
                          <div className="flex items-start gap-2">
                            <Trophy className="w-3.5 h-3.5 text-gold mt-0.5" strokeWidth={1.5} />
                            <div>
                              <p className="text-xs text-white/50">Best of Best</p>
                              <p className="text-sm text-gold font-medium">
                                {submission.finalWinner.brand} {submission.finalWinner.model}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Number of Watches */}
                        {selectedCount > 0 && (
                          <div className="flex items-center gap-2">
                            <List className="w-3.5 h-3.5 text-white/40" strokeWidth={1.5} />
                            <p className="text-xs text-white/50">
                              {selectedCount} {selectedCount === 1 ? 'watch' : 'watches'} selected
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: View Details Button */}
                    <button
                      onClick={() => toggleExpand(submission.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 glass-panel glass-panel-hover rounded-[12px]
                        text-xs text-white/60 hover:text-gold transition-all flex-shrink-0"
                    >
                      {isExpanded ? (
                        <>
                          Hide
                          <ChevronUp className="w-4 h-4" strokeWidth={1.5} />
                        </>
                      ) : (
                        <>
                          Details
                          <ChevronDown className="w-4 h-4" strokeWidth={1.5} />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="border-t border-white/5"
                    >
                      <div className="p-4 space-y-4 bg-black/10">
                        {/* All Selected Watches */}
                        {submission.selectedWatches && submission.selectedWatches.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-white/50 uppercase mb-2 tracking-wider">
                              Top 5 Selected Watches
                            </h4>
                            <div className="space-y-1.5">
                              {submission.selectedWatches.map((watch, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 text-sm text-white/80 glass-panel px-3 py-2 rounded-[12px]"
                                >
                                  <span className="text-white/40 font-mono text-xs">{idx + 1}.</span>
                                  <span className="font-medium">{watch.brand}</span>
                                  <span className="text-white/30">•</span>
                                  <span className="text-white/60">{watch.model}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Best of Best Winner (Highlighted) */}
                        {submission.finalWinner && (
                          <div>
                            <h4 className="text-xs font-semibold text-gold uppercase mb-2 flex items-center gap-1.5 tracking-wider">
                              <Trophy className="w-3.5 h-3.5" strokeWidth={1.5} />
                              Best of Best Winner
                            </h4>
                            <div className="glass-panel-selected rounded-[12px] px-3 py-2">
                              <p className="text-gold font-semibold text-sm">
                                {submission.finalWinner.brand} {submission.finalWinner.model}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Submission Timestamp */}
                        <div className="pt-2 border-t border-white/5">
                          <p className="text-xs text-white/40">
                            Submitted: {formatDateTime(submission.timestamp)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
