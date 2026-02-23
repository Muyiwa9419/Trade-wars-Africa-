import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Shield, BarChart3, Search, ArrowRight, Award, Trophy, Zap } from 'lucide-react';
import { Trader } from '../types';
import { socket } from '../services/socket';
import { Logo } from '../components/Layout';

export const Home = () => {
  const [topTraders, setTopTraders] = useState<Trader[]>([]);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => setTopTraders(data.slice(0, 5)));

    socket.on('leaderboard_update', (updatedTraders: Trader[]) => {
      setTopTraders(updatedTraders.slice(0, 5));
    });

    return () => {
      socket.off('leaderboard_update');
    };
  }, []);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,49,49,0.05),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-2 bg-twa-red/10 border border-twa-red/20 px-3 py-1 rounded-full mb-6">
                <span className="w-2 h-2 bg-twa-red rounded-full animate-pulse" />
                <span className="text-twa-red text-xs font-bold uppercase tracking-widest">Season 1 Now Live</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Africa's First <br />
                <span className="text-twa-green italic">Skill-Based</span> <br />
                Trading Competition
              </h1>
              <p className="text-xl text-white/60 mb-10 max-w-lg leading-relaxed">
                Compete. Prove Your Edge. Earn Your Rank. Join the elite league where performance and discipline define your success.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/register" className="twa-button-primary flex items-center justify-center space-x-2">
                  <span>Join Season 1</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/leaderboard" className="twa-button-secondary flex items-center justify-center space-x-2">
                  <span>View Leaderboard</span>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="twa-card bg-twa-charcoal/50 backdrop-blur-xl border-white/10 p-0 overflow-hidden">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <span className="text-xs font-mono text-white/40 uppercase tracking-widest">Live Leaderboard Preview</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr>
                        <th className="twa-table-header">Rank</th>
                        <th className="twa-table-header">Trader ID</th>
                        <th className="twa-table-header">Return</th>
                        <th className="twa-table-header">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topTraders.map((trader, idx) => (
                        <tr key={trader.trader_id} className="twa-table-row">
                          <td className="twa-table-cell text-twa-red font-bold">#{idx + 1}</td>
                          <td className="twa-table-cell">{trader.trader_id}</td>
                          <td className="twa-table-cell text-twa-green">+{trader.return_pct}%</td>
                          <td className="twa-table-cell">{trader.overall_score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-twa-gold/10 blur-3xl rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-twa-green/20 blur-3xl rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: What is TWA */}
      <section className="py-24 bg-twa-charcoal/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What is Trade Wars Africa?</h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              A structured trading league where traders compete based on performance, discipline, and risk management over a fixed competition period.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <BarChart3 className="text-twa-red" size={32} />, title: 'Performance Based', desc: 'Rankings are determined by pure trading results and consistency.' },
              { icon: <Shield className="text-twa-red" size={32} />, title: 'Strict Risk Control', desc: 'We value discipline. Excessive drawdown or reckless trading is penalized.' },
              { icon: <Search className="text-twa-red" size={32} />, title: 'Transparent Rankings', desc: 'Real-time leaderboard with verified data for complete transparency.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="twa-card text-center"
              >
                <div className="w-16 h-16 bg-twa-red/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-white/50 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: How it Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-white/50">Four simple steps to join the elite.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Register', desc: 'Create your profile and select your league tier.' },
              { step: '02', title: 'Verify Account', desc: 'Connect your trading account for real-time tracking.' },
              { step: '03', title: 'Trade for 30 Days', desc: 'Execute your strategy within our risk parameters.' },
              { step: '04', title: 'Top Performers Win', desc: 'Earn your rank and claim your share of the prize pool.' },
            ].map((item, i) => (
              <div key={i} className="twa-card relative overflow-hidden group">
                <span className="absolute -right-4 -top-4 text-8xl font-display font-black text-white/5 group-hover:text-twa-red/10 transition-colors">
                  {item.step}
                </span>
                <h3 className="text-xl font-bold mb-4 relative z-10">{item.title}</h3>
                <p className="text-white/50 relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Prize Pool */}
      <section className="py-24 bg-twa-red/5 border-y border-twa-red/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Season 1 Prize Pool</h2>
              <div className="text-6xl font-display font-bold text-twa-red mb-8">
                ₦4,000,000
              </div>
              <p className="text-white/60 mb-10 leading-relaxed">
                We reward excellence. The top performers across all tiers share in the massive prize pool, with additional awards for consistency and risk management.
              </p>
              <div className="space-y-4">
                {[
                  { rank: '1st Place', prize: '₦2,000,000' },
                  { rank: '2nd Place', prize: '₦1,000,000' },
                  { rank: '3rd Place', prize: '₦500,000' },
                  { rank: 'Performance Awards', prize: '₦500,000' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/5">
                    <span className="font-bold">{item.rank}</span>
                    <span className="text-twa-red font-mono">{item.prize}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-twa-charcoal rounded-2xl border border-white/5 flex flex-col items-center justify-center p-8 text-center">
                <Award size={48} className="text-twa-red mb-4" />
                <span className="text-sm text-white/40 uppercase tracking-widest mb-2">Elite Tier</span>
                <span className="text-2xl font-bold">Top 1%</span>
              </div>
              <div className="aspect-square bg-twa-charcoal rounded-2xl border border-white/5 flex flex-col items-center justify-center p-8 text-center mt-8">
                <Trophy size={48} className="text-twa-red mb-4" />
                <span className="text-sm text-white/40 uppercase tracking-widest mb-2">Consistency</span>
                <span className="text-2xl font-bold">90+ Score</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="twa-card bg-gradient-to-br from-twa-red/20 to-twa-green/20 border-twa-red/30 p-16 text-center">
            <h2 className="text-5xl font-bold mb-8">Ready to Compete?</h2>
            <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
              Join the most prestigious trading league in Africa. Prove your edge and claim your place on the leaderboard.
            </p>
            <Link to="/register" className="twa-button-primary inline-flex items-center space-x-3 text-lg px-12 py-4">
              <span>Join Season 1</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
