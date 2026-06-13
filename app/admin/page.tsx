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
} from 'lucide-react';
import WatchManagement from '@/components/admin/WatchManagement';
import StatsCard from '@/components/admin/StatsCard';
import SubmissionsList from '@/components/admin/SubmissionsList';
import VotesChart from '@/components/admin/VotesChart';
import RankingsList from '@/components/admin/RankingsList';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [watches, setWatches] = useState<Watch[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'management'>('overview');
  const [stats, setStats] = useState<WatchStats[]>([]);

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
          watchId: data.watchId,
          watchBrand: data.watchBrand,
          watchModel: data.watchModel,
          sessionId: data.sessionId,
          nickname: data.nickname,
          timestamp: data.timestamp?.toDate() || new Date(),
        };
      }) as Submission[];
      
      setSubmissions(submissionsData);
      calculateStats(submissionsData, watches);
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
    setLoading(false);
  }

  function calculateStats(subs: Submission[], ws: Watch[]) {
    const voteCounts = new Map<string, number>();
    
    subs.forEach(sub => {
      voteCounts.set(sub.watchId, (voteCounts.get(sub.watchId) || 0) + 1);
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
    const headers = ['Watch Brand', 'Watch Model', 'Timestamp', 'Session ID', 'Nickname'];
    const rows = submissions.map(sub => [
      sub.watchBrand,
      sub.watchModel,
      sub.timestamp.toISOString(),
      sub.sessionId,
      sub.nickname || 'Anonymous',
    ]);

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
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-block p-3 bg-amber-500/10 rounded-full mb-4">
                <Settings className="w-8 h-8 text-amber-500" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-zinc-400">Enter password to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white
                    focus:outline-none focus:border-amber-500 transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold py-3 rounded-lg
                  hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300"
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
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    );
  }

  const topWatch = stats[0];
  const totalVotes = submissions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Watch Picker Admin</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors text-sm"
            >
              Export CSV
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
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
                color="amber"
              />
              <StatsCard
                icon={<Trophy className="w-6 h-6" />}
                label="Most Popular"
                value={topWatch ? `${topWatch.brand} ${topWatch.model}` : 'N/A'}
                color="amber"
              />
              <StatsCard
                icon={<BarChart3 className="w-6 h-6" />}
                label="Top Vote %"
                value={topWatch ? `${topWatch.percentage.toFixed(1)}%` : '0%'}
                color="amber"
              />
            </div>

            {/* Rankings */}
            <RankingsList stats={stats} />

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
