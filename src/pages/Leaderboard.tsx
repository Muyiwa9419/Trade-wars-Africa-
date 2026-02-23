import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, ArrowUpRight, TrendingUp, ShieldAlert, Target, Heart, X, CreditCard, ShieldCheck } from 'lucide-react';
import { Trader } from '../types';
import { socket } from '../services/socket';

export const Leaderboard = () => {
  const [traders, setTraders] = useState<Trader[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingTrader, setVotingTrader] = useState<Trader | null>(null);
  const [voterEmail, setVoterEmail] = useState('');
  const [voteAmount, setVoteAmount] = useState(1000);
  const [isVoting, setIsVoting] = useState(false);
  const [voteStep, setVoteStep] = useState<'form' | 'payment'>('form');
  const [voteError, setVoteError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        setTraders(data);
        setLoading(false);
      });

    socket.on('leaderboard_update', (updatedTraders: Trader[]) => {
      setTraders(updatedTraders);
    });

    return () => {
      socket.off('leaderboard_update');
    };
  }, []);

  const handleVote = async (e: React.FormEvent) => {
    e.preventDefault();
    setVoteStep('payment');
  };

  const confirmVotePayment = async () => {
    if (!votingTrader) return;
    setIsVoting(true);
    setVoteError(null);
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trader_id: votingTrader.trader_id,
          voter_email: voterEmail,
          amount: voteAmount
        })
      });
      const data = await res.json();
      if (res.ok) {
        setVotingTrader(null);
        setVoterEmail('');
        setVoteStep('form');
      } else {
        setVoteError(data.error || 'Voting failed. Please try again.');
      }
    } catch (error) {
      setVoteError('Network error. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-bold mb-4">Official Leaderboard</h1>
            <p className="text-white/50 max-w-xl">
              Real-time rankings of Africa's top traders. Performance is calculated based on return, drawdown, and consistency.
            </p>
          </div>
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input
                type="text"
                placeholder="Search Trader ID..."
                className="bg-twa-charcoal border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-twa-red transition-colors w-64"
              />
            </div>
            <button className="bg-twa-charcoal border border-white/10 rounded-lg px-4 py-2 text-sm flex items-center space-x-2 hover:bg-white/5 transition-colors">
              <Filter size={18} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Participants', value: '1,240', icon: <TrendingUp className="text-twa-green" size={20} /> },
            { label: 'Avg. Return', value: '+12.4%', icon: <TrendingUp className="text-twa-green" size={20} /> },
            { label: 'Avg. Drawdown', value: '4.2%', icon: <ShieldAlert className="text-twa-red" size={20} /> },
            { label: 'Active Season', value: 'Season 1', icon: <Target className="text-twa-red" size={20} /> },
          ].map((stat, i) => (
            <div key={i} className="twa-card p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="twa-card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="twa-table-header">Rank</th>
                  <th className="twa-table-header">Nickname</th>
                  <th className="twa-table-header">Return %</th>
                  <th className="twa-table-header">Max DD</th>
                  <th className="twa-table-header">Consistency</th>
                  <th className="twa-table-header">Risk Score</th>
                  <th className="twa-table-header">Overall Score</th>
                  <th className="twa-table-header">Votes</th>
                  <th className="twa-table-header text-right">Support</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={9} className="p-8 border-b border-white/5">
                        <div className="h-4 bg-white/5 rounded w-full" />
                      </td>
                    </tr>
                  ))
                ) : (
                  traders.map((trader, idx) => (
                    <motion.tr
                      key={trader.trader_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="twa-table-row group"
                    >
                      <td className="twa-table-cell">
                        <div className="flex items-center space-x-3">
                          <span className={`w-8 h-8 rounded flex items-center justify-center font-bold ${
                            idx === 0 ? 'bg-twa-red text-white' : 
                            idx === 1 ? 'bg-white/20 text-white' :
                            idx === 2 ? 'bg-twa-green/40 text-twa-green' : 'text-white/40'
                          }`}>
                            {idx + 1}
                          </span>
                        </div>
                      </td>
                      <td className="twa-table-cell font-bold text-white group-hover:text-twa-red transition-colors">
                        {trader.trader_id}
                      </td>
                      <td className="twa-table-cell text-twa-green">+{trader.return_pct}%</td>
                      <td className="twa-table-cell text-twa-red">{trader.max_drawdown}%</td>
                      <td className="twa-table-cell">{trader.consistency_score}</td>
                      <td className="twa-table-cell">{trader.risk_score}</td>
                      <td className="twa-table-cell">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-lg">{trader.overall_score}</span>
                          <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-twa-red" 
                              style={{ width: `${trader.overall_score}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="twa-table-cell">
                        <div className="flex items-center space-x-1 text-twa-red">
                          <Heart size={14} fill="currentColor" />
                          <span className="font-bold">{trader.votes || 0}</span>
                        </div>
                      </td>
                      <td className="twa-table-cell text-right">
                        <button 
                          onClick={() => setVotingTrader(trader)}
                          className="px-3 py-1 bg-twa-red/10 text-twa-red text-xs font-bold rounded hover:bg-twa-red hover:text-white transition-all flex items-center space-x-1 ml-auto"
                        >
                          <Heart size={12} />
                          <span>Vote</span>
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Voting Modal */}
        {votingTrader && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-twa-charcoal border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center space-x-2">
                  <Heart className="text-twa-red" fill="currentColor" />
                  <span>{voteStep === 'form' ? `Support ${votingTrader.trader_id}` : 'Complete Payment'}</span>
                </h2>
                <button onClick={() => { setVotingTrader(null); setVoteStep('form'); }} className="text-white/40 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              {voteStep === 'form' ? (
                <form onSubmit={handleVote} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Your Email</label>
                    <input
                      required
                      type="email"
                      value={voterEmail}
                      onChange={e => setVoterEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-twa-red transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Vote Amount (₦)</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[1000, 5000, 10000].map(amount => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setVoteAmount(amount)}
                          className={`py-2 rounded-lg border text-sm font-bold transition-all ${
                            voteAmount === amount 
                              ? 'bg-twa-red border-twa-red text-white' 
                              : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                          }`}
                        >
                          ₦{amount.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-twa-red/5 border border-twa-red/20 rounded-xl">
                    <p className="text-xs text-white/60 leading-relaxed text-center">
                      Your contribution helps support the trader and increases their popularity score. 100% secure payment processing.
                    </p>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full twa-button-primary py-4 flex items-center justify-center space-x-2"
                  >
                    <CreditCard size={18} />
                    <span>Proceed to Payment</span>
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40 uppercase tracking-widest">Bank Name</span>
                      <span className="font-bold">TradeWars Africa Bank</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40 uppercase tracking-widest">Account Number</span>
                      <span className="font-mono font-bold text-lg">0123456789</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <span className="text-xs text-white/40 uppercase tracking-widest">Amount Due</span>
                      <span className="text-xl font-bold text-twa-red">₦{voteAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {voteError && (
                      <div className="p-3 bg-twa-red/10 border border-twa-red/20 rounded-lg flex items-center space-x-2 text-twa-red text-xs">
                        <ShieldAlert size={14} />
                        <span>{voteError}</span>
                      </div>
                    )}
                    <button 
                      onClick={confirmVotePayment}
                      disabled={isVoting}
                      className="w-full twa-button-primary py-4 flex items-center justify-center space-x-2"
                    >
                      {isVoting ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <ShieldCheck size={18} />
                          <span>I Have Made the Transfer</span>
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => setVoteStep('form')}
                      className="w-full text-white/40 text-sm hover:text-white transition-colors"
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};
