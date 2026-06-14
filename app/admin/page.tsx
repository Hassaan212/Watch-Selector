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
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold blur-[120px]"
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
      <div className="min-h-screen liquid-glass-bg flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-gold" strokeWidth={1.5} />
        </motion.div>
      </div>
    );
  }

  const topWatch = stats[0];
  const totalVotes = submissions.length;

  return (
    <div className="min-h-screen liquid-glass-bg relative overflow-hidden">
      {/* Ambient Light Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.02, 0.04, 0.02],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gold blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.015, 0.03, 0.015],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-white blur-[150px]"
        />
      </div>

      {/* Header */}
      <header className="glass-panel border-b border-white/5 sticky top-0 z-50 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white tracking-tight">Watch Picker Admin</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2.5 glass-panel glass-panel-hover rounded-[16px] text-white text-sm transition-all duration-300"
            >
              <Download className="w-4 h-4" strokeWidth={1.5} />
              Export CSV
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 glass-panel glass-panel-hover rounded-[16px] text-white transition-all duration-300"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4 border-b border-zinc-800">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 font-medium transition-colors relative ${
                activeTab === 'overview'
                  ? 'text-amber-500'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Overview
              {activeTab === 'overview' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('management')}
              className={`px-4 py-3 font-medium transition-colors relative ${
                activeTab === 'management'
                  ? 'text-amber-500'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Manage Watches
              {activeTab === 'management' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' ? (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            </div>

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
          </div>
        ) : (
          <WatchManagement watches={watches} onUpdate={loadData} />
        )}
      </main>
    </div>
  );
}
