import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Trophy, 
  Trash2, 
  Plus, 
  ShieldCheck, 
  AlertCircle,
  Search,
  Download,
  Target
} from 'lucide-react';
import { Trader } from '../types';

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'leaderboard' | 'seasons'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [traders, setTraders] = useState<Trader[]>([]);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTrader, setShowAddTrader] = useState(false);
  const [showAddSeason, setShowAddSeason] = useState(false);
  const [newSeasonName, setNewSeasonName] = useState('');
  const [newTrader, setNewTrader] = useState({
    trader_id: '',
    return_pct: 0,
    max_drawdown: 0,
    consistency_score: 0,
    total_trades: 0,
    risk_score: 0,
    overall_score: 0
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [activeTab, isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        setIsAuthenticated(true);
        setLoginError('');
      } else {
        setLoginError('Invalid password');
      }
    } catch (error) {
      setLoginError('Login failed');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        setUsers(data);
      } else if (activeTab === 'leaderboard') {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        setTraders(data);
      } else {
        const res = await fetch('/api/seasons');
        const data = await res.json();
        setSeasons(data);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSeason = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/seasons/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSeasonName })
      });
      if (res.ok) {
        setShowAddSeason(false);
        setNewSeasonName('');
        fetchData();
      }
    } catch (error) {
      console.error('Error creating season:', error);
    }
  };

  const handleAddTrader = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/leaderboard/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrader)
      });
      if (res.ok) {
        setShowAddTrader(false);
        fetchData();
        setNewTrader({
          trader_id: '',
          return_pct: 0,
          max_drawdown: 0,
          consistency_score: 0,
          total_trades: 0,
          risk_score: 0,
          overall_score: 0
        });
      }
    } catch (error) {
      console.error('Error adding trader:', error);
    }
  };

  const handleDeleteTrader = async (id: number) => {
    if (!confirm('Are you sure you want to remove this trader?')) return;
    try {
      const res = await fetch(`/api/admin/leaderboard/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (error) {
      console.error('Error deleting trader:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="twa-card max-w-md w-full p-8"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-twa-red/10 rounded-full flex items-center justify-center">
              <ShieldCheck className="text-twa-red" size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">Admin Authentication</h2>
          <p className="text-center text-white/40 mb-8 text-sm">Enter the secure password to access the portal.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-twa-red transition-colors"
                placeholder="••••••••"
              />
            </div>
            {loginError && (
              <p className="text-twa-red text-xs flex items-center space-x-1">
                <AlertCircle size={14} />
                <span>{loginError}</span>
              </p>
            )}
            <button type="submit" className="w-full twa-button-primary py-4">
              Unlock Portal
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Admin Control Panel</h1>
            <p className="text-white/40">Manage competition participants, seasons, and leaderboard data.</p>
          </div>
          <div className="flex bg-twa-charcoal p-1 rounded-lg border border-white/5">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
                activeTab === 'users' ? 'bg-twa-red text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users size={16} />
                <span>Users</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
                activeTab === 'leaderboard' ? 'bg-twa-red text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Trophy size={16} />
                <span>Leaderboard</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('seasons')}
              className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
                activeTab === 'seasons' ? 'bg-twa-red text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Target size={16} />
                <span>Seasons</span>
              </div>
            </button>
          </div>
        </div>

        {activeTab === 'users' ? (
          <div className="twa-card p-0 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="font-bold flex items-center space-x-2">
                <Users className="text-twa-red" size={20} />
                <span>Registration Log ({users.length})</span>
              </h2>
              <button className="text-xs text-white/40 hover:text-white flex items-center space-x-1">
                <Download size={14} />
                <span>Export CSV</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="twa-table-header">
                    <th className="p-4">Name</th>
                    <th className="p-4">Nickname</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Tier</th>
                    <th className="p-4">Broker</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="twa-table-row">
                      <td className="p-4 font-bold text-white">{user.full_name}</td>
                      <td className="p-4 text-twa-red font-bold">{user.nickname}</td>
                      <td className="p-4 text-white/60">{user.email}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-twa-red/10 text-twa-red text-[10px] font-bold rounded uppercase">
                          {user.league_tier}
                        </span>
                      </td>
                      <td className="p-4 text-white/60">{user.broker}</td>
                      <td className="p-4 text-white/40 text-xs">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'leaderboard' ? (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button 
                onClick={() => setShowAddTrader(true)}
                className="twa-button-primary flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>Add Manual Trader</span>
              </button>
            </div>

            <div className="twa-card p-0 overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h2 className="font-bold flex items-center space-x-2">
                  <Trophy className="text-twa-red" size={20} />
                  <span>Active Competitors ({traders.length})</span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="twa-table-header">
                      <th className="p-4">Nickname</th>
                      <th className="p-4">Return</th>
                      <th className="p-4">Drawdown</th>
                      <th className="p-4">Score</th>
                      <th className="p-4">Votes</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {traders.map((trader) => (
                      <tr key={trader.id} className="twa-table-row">
                        <td className="p-4 font-bold text-white">{trader.trader_id}</td>
                        <td className="p-4 text-twa-green">+{trader.return_pct}%</td>
                        <td className="p-4 text-twa-red">{trader.max_drawdown}%</td>
                        <td className="p-4 font-bold">{trader.overall_score}</td>
                        <td className="p-4">{trader.votes || 0}</td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleDeleteTrader(trader.id!)}
                            className="p-2 text-white/20 hover:text-twa-red transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button 
                onClick={() => setShowAddSeason(true)}
                className="twa-button-primary flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>Create New Season</span>
              </button>
            </div>

            <div className="twa-card p-0 overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h2 className="font-bold flex items-center space-x-2">
                  <Target className="text-twa-red" size={20} />
                  <span>Competition Seasons</span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="twa-table-header">
                      <th className="p-4">Season Name</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seasons.map((season) => (
                      <tr key={season.id} className="twa-table-row">
                        <td className="p-4 font-bold text-white">{season.name}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${
                            season.status === 'active' ? 'bg-twa-green/10 text-twa-green' : 'bg-white/5 text-white/40'
                          }`}>
                            {season.status}
                          </span>
                        </td>
                        <td className="p-4 text-white/40 text-xs">
                          {new Date(season.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Add Trader Modal */}
        {showAddTrader && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-twa-charcoal border border-white/10 rounded-2xl p-8 w-full max-w-lg shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center space-x-2">
                  <Plus className="text-twa-red" />
                  <span>Add Manual Entry</span>
                </h2>
                <button onClick={() => setShowAddTrader(false)} className="text-white/40 hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddTrader} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest">Trader ID</label>
                    <input
                      required
                      type="text"
                      value={newTrader.trader_id}
                      onChange={e => setNewTrader({...newTrader, trader_id: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-twa-red"
                      placeholder="TWA-XXXX"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest">Return %</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={newTrader.return_pct}
                      onChange={e => setNewTrader({...newTrader, return_pct: parseFloat(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-twa-red"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest">Max Drawdown %</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={newTrader.max_drawdown}
                      onChange={e => setNewTrader({...newTrader, max_drawdown: parseFloat(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-twa-red"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest">Overall Score</label>
                    <input
                      required
                      type="number"
                      value={newTrader.overall_score}
                      onChange={e => setNewTrader({...newTrader, overall_score: parseInt(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-twa-red"
                    />
                  </div>
                </div>

                <div className="p-4 bg-twa-red/5 border border-twa-red/20 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="text-twa-red flex-shrink-0" size={18} />
                  <p className="text-xs text-white/60 leading-relaxed">
                    Manual entries will be broadcasted to all live clients immediately. Ensure data accuracy before submitting.
                  </p>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddTrader(false)}
                    className="flex-1 twa-button-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 twa-button-primary"
                  >
                    Add Trader
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
        {/* Add Season Modal */}
        {showAddSeason && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-twa-charcoal border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center space-x-2">
                  <Target className="text-twa-red" />
                  <span>Create New Season</span>
                </h2>
                <button onClick={() => setShowAddSeason(false)} className="text-white/40 hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddSeason} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-white/40 uppercase tracking-widest">Season Name</label>
                  <input
                    required
                    type="text"
                    value={newSeasonName}
                    onChange={e => setNewSeasonName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-twa-red"
                    placeholder="e.g. Season 2"
                  />
                </div>

                <div className="p-4 bg-twa-red/5 border border-twa-red/20 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="text-twa-red flex-shrink-0" size={18} />
                  <p className="text-xs text-white/60 leading-relaxed">
                    Creating a new season will automatically complete the current active season.
                  </p>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddSeason(false)}
                    className="flex-1 twa-button-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 twa-button-primary"
                  >
                    Create Season
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
