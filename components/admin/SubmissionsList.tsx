'use client';

import { motion } from 'framer-motion';
import { Submission } from '@/types';
import { Clock, User, Trophy } from 'lucide-react';

interface SubmissionsListProps {
  submissions: Submission[];
}

export default function SubmissionsList({ submissions }: SubmissionsListProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <div className="glass-panel rounded-[24px] p-6">
      <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Recent Submissions</h2>
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {submissions.map((submission, index) => (
          <motion.div
            key={submission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="glass-panel glass-panel-hover rounded-[16px] p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                {/* Display multiple watches (new format) */}
                {submission.selectedWatches && submission.selectedWatches.length > 0 ? (
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <p className="text-white/50 text-xs uppercase tracking-wider">Round 1 Selections:</p>
                      {submission.selectedWatches.map((watch, idx) => (
                        <p key={idx} className="text-white font-semibold text-sm">
                          {idx + 1}. {watch.brand} {watch.model}
                        </p>
                      ))}
                    </div>
                    {/* Display final winner if exists */}
                    {submission.finalWinner && (
                      <div className="mt-2 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-2 mb-1">
                          <Trophy className="w-4 h-4 text-gold" strokeWidth={1.5} />
                          <p className="text-gold text-xs uppercase font-semibold tracking-wider">Best of Best:</p>
                        </div>
                        <p className="text-gold font-bold">
                          {submission.finalWinner.brand} {submission.finalWinner.model}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Display single watch (old format) */
                  <p className="text-white font-semibold">
                    {submission.watchBrand} {submission.watchModel}
                  </p>
                )}
                {/* Participant Name */}
                {submission.participantName && (
                  <div className="flex items-center gap-2 mt-2">
                    <User className="w-3 h-3 text-gold" strokeWidth={1.5} />
                    <p className="text-gold text-sm font-medium">{submission.participantName}</p>
                  </div>
                )}
                {/* Legacy nickname field */}
                {!submission.participantName && submission.nickname && (
                  <div className="flex items-center gap-2 mt-2">
                    <User className="w-3 h-3 text-white/50" strokeWidth={1.5} />
                    <p className="text-white/60 text-sm">{submission.nickname}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm flex-shrink-0 ml-4">
                <Clock className="w-4 h-4" strokeWidth={1.5} />
                {formatDate(submission.timestamp)}
              </div>
            </div>
            <p className="text-white/30 text-xs font-mono truncate">
              Session: {submission.sessionId}
            </p>
          </motion.div>
        ))}
        {submissions.length === 0 && (
          <p className="text-white/40 text-center py-8">No submissions yet</p>
        )}
      </div>
    </div>
  );
}
