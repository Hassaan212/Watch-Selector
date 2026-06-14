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
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-6 h-6 text-amber-500" />
          <h2 className="text-xl font-bold text-white">Recent Participants</h2>
        </div>
        <p className="text-zinc-500 text-center py-8">No participants with names yet</p>
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
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="w-6 h-6 text-amber-500" />
        <h2 className="text-xl font-bold text-white">Recent Participants</h2>
        <span className="text-sm text-zinc-500">({participantsWithNames.length})</span>
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
              className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden hover:border-amber-500/50 transition-colors"
            >
              {/* Main Card */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Participant Info */}
                  <div className="flex-1 min-w-0">
                    {/* Name */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-amber-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-amber-500" />
                      </div>
                      <h3 className="text-white font-semibold truncate">
                        {submission.participantName}
                      </h3>
                    </div>

                    {/* Info Grid */}
                    <div className="ml-10 space-y-1.5">
                      {/* Date */}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                        <p className="text-xs text-zinc-400">
                          {formatDate(submission.timestamp)}
                        </p>
                      </div>

                      {/* Best of Best Winner */}
                      {submission.finalWinner && (
                        <div className="flex items-start gap-2">
                          <Trophy className="w-3.5 h-3.5 text-amber-500 mt-0.5" />
                          <div>
                            <p className="text-xs text-zinc-500">Best of Best</p>
                            <p className="text-sm text-amber-400 font-medium">
                              {submission.finalWinner.brand} {submission.finalWinner.model}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Number of Watches */}
                      {selectedCount > 0 && (
                        <div className="flex items-center gap-2">
                          <List className="w-3.5 h-3.5 text-zinc-600" />
                          <p className="text-xs text-zinc-400">
                            {selectedCount} {selectedCount === 1 ? 'watch' : 'watches'} selected
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: View Details Button */}
                  <button
                    onClick={() => toggleExpand(submission.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 
                      rounded-md text-xs text-zinc-400 hover:text-amber-500 transition-all flex-shrink-0"
                  >
                    {isExpanded ? (
                      <>
                        Hide
                        <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        View Details
                        <ChevronDown className="w-4 h-4" />
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
                    transition={{ duration: 0.2 }}
                    className="border-t border-zinc-800"
                  >
                    <div className="p-4 bg-zinc-900/50 space-y-4">
                      {/* All Selected Watches */}
                      {submission.selectedWatches && submission.selectedWatches.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-zinc-500 uppercase mb-2">
                            Top 5 Selected Watches
                          </h4>
                          <div className="space-y-1.5">
                            {submission.selectedWatches.map((watch, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-sm text-zinc-300 bg-zinc-950 px-3 py-2 rounded"
                              >
                                <span className="text-zinc-600 font-mono">{idx + 1}.</span>
                                <span>{watch.brand}</span>
                                <span className="text-zinc-600">•</span>
                                <span className="text-zinc-400">{watch.model}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Best of Best Winner (Highlighted) */}
                      {submission.finalWinner && (
                        <div>
                          <h4 className="text-xs font-semibold text-amber-500 uppercase mb-2 flex items-center gap-1.5">
                            <Trophy className="w-3.5 h-3.5" />
                            Best of Best Winner
                          </h4>
                          <div className="bg-amber-500/10 border border-amber-500/30 rounded px-3 py-2">
                            <p className="text-amber-400 font-semibold">
                              {submission.finalWinner.brand} {submission.finalWinner.model}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Submission Timestamp */}
                      <div className="pt-2 border-t border-zinc-800">
                        <p className="text-xs text-zinc-600">
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
  );
}
