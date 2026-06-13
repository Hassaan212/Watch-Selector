'use client';

import { motion } from 'framer-motion';
import { Submission } from '@/types';
import { Clock, User } from 'lucide-react';

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
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Recent Submissions</h2>
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {submissions.map((submission, index) => (
          <motion.div
            key={submission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="bg-zinc-950 border border-zinc-800 rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-white font-semibold">
                  {submission.watchBrand} {submission.watchModel}
                </p>
                {submission.nickname && (
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-3 h-3 text-zinc-500" />
                    <p className="text-zinc-400 text-sm">{submission.nickname}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <Clock className="w-4 h-4" />
                {formatDate(submission.timestamp)}
              </div>
            </div>
            <p className="text-zinc-500 text-xs font-mono truncate">
              Session: {submission.sessionId}
            </p>
          </motion.div>
        ))}
        {submissions.length === 0 && (
          <p className="text-zinc-400 text-center py-8">No submissions yet</p>
        )}
      </div>
    </div>
  );
}
