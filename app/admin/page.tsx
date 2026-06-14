'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Watch, Submission, WatchStats } from '@/types';
import { getWatches, getSubmissions } from '@/lib/watches';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import {
  BarChart3,
  Users,
  Trophy,
  Clock,
  LogOut,
  Settings,
  Loader2,
  Download,
} from 'lucide-react';
import WatchManagement from '@/components/admin/WatchManagement';
import StatsCard from '@/components/admin/StatsCard';
import SubmissionsList from '@/components/admin/SubmissionsList';
import VotesChart from '@/components/admin/VotesChart';
import RankingsList from '@/components/admin/RankingsList';
import BestOfBestRankings from '@/components/admin/BestOfBestRankings';
import RecentParticipants from '@/components/admin/RecentParticipants';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [watches, setWatches] = useState<Watch[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'management'>('overview');
  const [stats, setStats] = useState<WatchStats[]>([]);
  const [bestOfBestStats, setBestOfBestStats] = useState<WatchStats[]>([]);

  useEffect(() => {
    // Check if already authenticated
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadData();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Set up real-time listener for submissions
    const q = query(
      collection(db, 'submissions'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const submissionsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          // Round 1: Multiple selections
          watchIds: data.watchIds,
          selectedWatches: data.selectedWatches,
          // Round 2: Final winner
          finalWinnerId: data.finalWinnerId,
          finalWinner: data.finalWinner,
          // Old format
          watchId: data.watchId,
          watchBrand: data.watchBrand,
          watchModel: data.watchModel,
          // Common fields
          sessionId: data.sessionId,
          nickname: data.nickname,
          participantName: data.participantName,
          timestamp: data.timestamp?.toDate() || new Date(),
        };
      }) as Submission[];
      
      setSubmissions(submissionsData);
      calculateStats(submissionsData, watches);
      calculateBestOfBestStats(submissionsData, watches);
    });

    return () => unsubscribe();
  }, [isAuthenticated, watches]);

  async function loadData() {
    setLoading(true);
    const watchesData = await getWatches();
    const submissionsData = await getSubmissions();
    
    setWatches(watchesData);
    setSubmissions(submissionsData);
    calculateStats(submissionsData, watchesData);
    calculateBestOfBestStats(submissionsData, watchesData);
    setLoading(false);
  }

  function calculateStats(subs: Submission[], ws: Watch[]) {
    const voteCounts = new Map<string, number>();
    
    subs.forEach(sub => {
      // Handle NEW format (multiple watches - 3 selections)
      if (sub.selectedWatches && Array.isArray(sub.selectedWatches)) {
        sub.selectedWatches.forEach(watch => {
          voteCounts.set(watch.id, (voteCounts.get(watch.id) || 0) + 1);
        });
      }
      // Handle OLD format (single watch) - BACKWARD COMPATIBLE
      else if (sub.watchId) {
        voteCounts.set(sub.watchId, (voteCounts.get(sub.watchId) || 0) + 1);
      }
    });

    const total = subs.length;
    const statsData: WatchStats[] = ws.map(watch => ({
      watchId: watch.id,
      brand: watch.brand,
      model: watch.model,
      count: voteCounts.get(watch.id) || 0,
      percentage: total > 0 ? ((voteCounts.get(watch.id) || 0) / total) * 100 : 0,
      rank: 0,
    }));

    // Sort by count and assign ranks
    statsData.sort((a, b) => b.count - a.count);
    statsData.forEach((stat, index) => {
      stat.rank = index + 1;
    });

    setStats(statsData);
  }

  function calculateBestOfBestStats(subs: Submission[], ws: Watch[]) {
    const winnerCounts = new Map<string, number>();
    
    subs.forEach(sub => {
      // Count only final winners (Round 2 selections)
      if (sub.finalWinnerId) {
        winnerCounts.set(sub.finalWinnerId, (winnerCounts.get(sub.finalWinnerId) || 0) + 1);
      }
    });

    // Count total final round submissions
    const totalWinners = Array.from(winnerCounts.values()).reduce((sum, count) => sum + count, 0);
    
    const bestOfBestData: WatchStats[] = ws.map(watch => ({
      watchId: watch.id,
      brand: watch.brand,
      model: watch.model,
      count: winnerCounts.get(watch.id) || 0,
      percentage: totalWinners > 0 ? ((winnerCounts.get(watch.id) || 0) / totalWinners) * 100 : 0,
      rank: 0,
    }));

    // Sort by count and assign ranks
    bestOfBestData.sort((a, b) => b.count - a.count);
    bestOfBestData.forEach((stat, index) => {
      stat.rank = index + 1;
    });

    setBestOfBestStats(bestOfBestData);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    
    if (password === adminPassword) {
      sessionStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
      loadData();
    } else {
      alert('Incorrect password');
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    setPassword('');
  }

  function exportToCSV() {
    const headers = ['Participant Name', 'Top 5 Watches', 'Best of Best Winner', 'Submission Date', 'Session ID'];
    const rows = submissions.map(sub => {
      let watchesText = '';
      let winnerText = '';
      
      // New format (5 watches + final winner)
      if (sub.selectedWatches && sub.selectedWatches.length > 0) {
        watchesText = sub.selectedWatches
          .map(w => `${w.brand} ${w.model}`)
          .join(' | ');
      }
      // Old format (single watch)
      else if (sub.watchBrand && sub.watchModel) {
        watchesText = `${sub.watchBrand} ${sub.watchModel}`;
      }
      
      // Final winner (Round 2)
      if (sub.finalWinner) {
        winnerText = `${sub.finalWinner.brand} ${sub.finalWinner.model}`;
      }
      
      const participantName = sub.participantName || 'Anonymous';
      
      return [
        participantName,
        watchesText,
        winnerText,
        sub.timestamp.toISOString(),
        sub.sessionId,
      ];
    });

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `watch-picker-results-${new Date().toISOString()}.csv`;
    a.click();
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen liquid-glass-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Light Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-[800px] h-[800px] rounded-full blur-[180px]"
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.18) 0%, rgba(212, 175, 55, 0.08) 40%, transparent 70%)'
          }}
        />
      </div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-md relative z-10"
        >
          <div className="glass-panel rounded-[30px] p-10 shadow-2xl">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.2,
                  type: 'spring',
                  stiffness: 200,
                  damping: 15
                }}
                className="inline-flex p-5 glass-panel rounded-[24px] mb-6"
              >
                <Settings className="w-8 h-8 text-gold" strokeWidth={1.5} />
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Admin Dashboard</h1>
              <p className="text-white/60">Enter password to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-5 py-4 glass-input rounded-[20px] text-white
                    focus:outline-none transition-all duration-300 placeholder:text-white/30"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full glass-button text-black font-semibold py-4 rounded-[20px]
                  transition-all duration-300"
              >
                Login
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen liquid-glass-bg flex items-center justify-center relative overflow-hidden">
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

  const topWatch = stats[0];
  const totalVotes = submissions.length;

  return (
    <div className="min-h-screen liquid-glass-bg relative overflow-hidden">
      {/* Luxury Ambient Lighting - Refined Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.09, 0.05],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[15%] right-[20%] w-[900px] h-[900px] rounded-full blur-[200px]"
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, rgba(212, 175, 55, 0.05) 40%, transparent 70%)'
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.04, 0.07, 0.04],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute bottom-[20%] left-[15%] w-[800px] h-[800px] rounded-full blur-[180px]"
          style={{
            background: 'radial-gradient(circle, rgba(192, 192, 192, 0.08) 0%, rgba(192, 192, 192, 0.03) 45%, transparent 70%)'
          }}
        />
      </div>

      {/* Premium Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 25
        }}
        className="glass-panel border-b border-white/5 sticky top-0 z-50 backdrop-blur-2xl"
        style={{
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white tracking-tight">Watch Picker Admin</h1>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{
                scale: 1.02,
                y: -1,
                transition: {
                  type: 'spring',
                  stiffness: 400,
                  damping: 25
                }
              }}
              whileTap={{
                scale: 0.98,
                transition: {
                  type: 'spring',
                  stiffness: 400,
                  damping: 25
                }
              }}
              onClick={exportToCSV}
              className="flex items-center gap-2 px-5 py-2.5 glass-panel rounded-[18px] text-white text-sm cursor-pointer group"
              style={{
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(248, 248, 240, 0.06)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <style jsx>{`
                button:hover {
                  background: linear-gradient(135deg, rgba(255, 255, 255, 0.055) 0%, rgba(255, 255, 255, 0.03) 100%) !important;
                  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4), 
                              0 0 0 1px rgba(212, 175, 55, 0.12),
                              inset 0 1px 0 rgba(248, 248, 240, 0.08) !important;
                }
              `}</style>
              <Download className="w-4 h-4 group-hover:text-gold transition-colors duration-200" strokeWidth={1.5} />
              <span className="group-hover:text-white transition-colors duration-200">Export CSV</span>
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.02,
                y: -1,
                transition: {
                  type: 'spring',
                  stiffness: 400,
                  damping: 25
                }
              }}
              whileTap={{
                scale: 0.98,
                transition: {
                  type: 'spring',
                  stiffness: 400,
                  damping: 25
                }
              }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 glass-panel rounded-[18px] text-white cursor-pointer group"
              style={{
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(248, 248, 240, 0.06)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <style jsx>{`
                button:hover {
                  background: linear-gradient(135deg, rgba(255, 255, 255, 0.055) 0%, rgba(255, 255, 255, 0.03) 100%) !important;
                  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4), 
                              0 0 0 1px rgba(212, 175, 55, 0.12),
                              inset 0 1px 0 rgba(248, 248, 240, 0.08) !important;
                }
              `}</style>
              <LogOut className="w-4 h-4 group-hover:text-gold transition-colors duration-200" strokeWidth={1.5} />
              <span className="group-hover:text-white transition-colors duration-200">Logout</span>
            </motion.button>
          </div>
        </div>

        {/* Refined Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6 border-b border-white/[0.08]">
            <motion.button
              whileHover={{
                y: -1,
                transition: {
                  type: 'spring',
                  stiffness: 400,
                  damping: 25
                }
              }}
              onClick={() => setActiveTab('overview')}
              className={`px-5 py-3.5 font-semibold transition-colors relative cursor-pointer ${
                activeTab === 'overview'
                  ? 'text-gold'
                  : 'text-white/50 hover:text-white'
              }`}
              style={{
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Overview
              {activeTab === 'overview' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full"
                  style={{
                    background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.6), rgba(212, 175, 55, 1), rgba(212, 175, 55, 0.6))',
                    boxShadow: '0 0 12px rgba(212, 175, 55, 0.6)'
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30
                  }}
                />
              )}
            </motion.button>
            <motion.button
              whileHover={{
                y: -1,
                transition: {
                  type: 'spring',
                  stiffness: 400,
                  damping: 25
                }
              }}
              onClick={() => setActiveTab('management')}
              className={`px-5 py-3.5 font-semibold transition-colors relative cursor-pointer ${
                activeTab === 'management'
                  ? 'text-gold'
                  : 'text-white/50 hover:text-white'
              }`}
              style={{
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Manage Watches
              {activeTab === 'management' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full"
                  style={{
                    background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.6), rgba(212, 175, 55, 1), rgba(212, 175, 55, 0.6))',
                    boxShadow: '0 0 12px rgba(212, 175, 55, 0.6)'
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30
                  }}
                />
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Stats Cards with Staggered Animation */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.08
                  }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <StatsCard
                icon={<Users className="w-6 h-6" />}
                label="Total Votes"
                value={totalVotes.toString()}
                color="gold"
              />
              <StatsCard
                icon={<Trophy className="w-6 h-6" />}
                label="Most Popular"
                value={topWatch ? `${topWatch.brand} ${topWatch.model}` : 'N/A'}
                color="gold"
              />
              <StatsCard
                icon={<BarChart3 className="w-6 h-6" />}
                label="Top Vote %"
                value={topWatch ? `${topWatch.percentage.toFixed(1)}%` : '0%'}
                color="gold"
              />
            </motion.div>

            {/* Rankings */}
            <RankingsList stats={stats} />

            {/* Best of Best Rankings */}
            <BestOfBestRankings stats={bestOfBestStats} />

            {/* Recent Participants */}
            <RecentParticipants submissions={submissions} />

            {/* Chart */}
            <VotesChart stats={stats} />

            {/* Recent Submissions */}
            <SubmissionsList submissions={submissions} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 25
            }}
          >
            <WatchManagement watches={watches} onUpdate={loadData} />
          </motion.div>
        )}
      </main>
    </div>
  );
}
