import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Clock, 
  TrendingUp, 
  ShieldAlert, 
  Activity, 
  Award,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { socket } from '../services/socket';
import { Trader } from '../types';

const mockEquityData = [
  { day: 'Day 1', equity: 10000 },
  { day: 'Day 5', equity: 10500 },
  { day: 'Day 10', equity: 10300 },
  { day: 'Day 15', equity: 11200 },
  { day: 'Day 20', equity: 11800 },
  { day: 'Day 25', equity: 11600 },
  { day: 'Day 30', equity: 12400 },
];

export const Dashboard = () => {
  const [userStats, setUserStats] = useState<Partial<Trader>>({
    trader_id: 'TWA-8821',
    overall_score: 94.2,
    return_pct: 42.5,
    max_drawdown: 4.2
  });
  const [rank, setRank] = useState(1);

  useEffect(() => {
    socket.on('leaderboard_update', (updatedTraders: Trader[]) => {
      const me = updatedTraders.find(t => t.trader_id === 'TWA-8821');
      const myRank = updatedTraders.findIndex(t => t.trader_id === 'TWA-8821') + 1;
      
      if (me) {
        setUserStats(me);
        setRank(myRank);
      }
    });

    return () => {
      socket.off('leaderboard_update');
    };
  }, []);
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-4xl font-bold">Trader Dashboard</h1>
              <span className="bg-twa-gold/10 text-twa-gold text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-twa-gold/20">
                Season 1 Active
              </span>
            </div>
            <p className="text-white/50">Welcome back, TWA-8821. Your performance is currently in the top 1%.</p>
          </div>
          <div className="flex items-center space-x-4 bg-twa-charcoal p-4 rounded-xl border border-white/5">
            <Clock className="text-twa-red" size={20} />
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Season Ends In</p>
              <p className="text-lg font-mono font-bold">12d : 08h : 44m</p>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          <div className="twa-card">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Current Rank</p>
            <div className="flex items-end space-x-2">
              <span className="text-4xl font-bold text-twa-red">#{rank}</span>
              <span className="text-sm text-twa-green mb-1">↑ {rank === 1 ? 'Stable' : 'Active'}</span>
            </div>
          </div>
          <div className="twa-card">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Overall Score</p>
            <div className="flex items-end space-x-2">
              <span className="text-4xl font-bold">{userStats.overall_score}</span>
              <span className="text-sm text-white/30 mb-1">/ 100</span>
            </div>
          </div>
          <div className="twa-card">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Total Return</p>
            <div className="flex items-end space-x-2">
              <span className="text-4xl font-bold text-twa-green">+{userStats.return_pct}%</span>
            </div>
          </div>
          <div className="twa-card">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Max Drawdown</p>
            <div className="flex items-end space-x-2">
              <span className="text-4xl font-bold text-twa-red">{userStats.max_drawdown}%</span>
              <span className="text-xs text-white/30 mb-1">Limit: 10%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Equity Curve */}
          <div className="lg:col-span-2 twa-card p-0 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold flex items-center space-x-2">
                <TrendingUp size={18} className="text-twa-red" />
                <span>Equity Curve</span>
              </h3>
              <select className="bg-transparent text-xs text-white/40 border-none focus:ring-0 cursor-pointer">
                <option>Last 30 Days</option>
                <option>Season 1 Total</option>
              </select>
            </div>
            <div className="h-[400px] w-full p-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockEquityData}>
                  <defs>
                    <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF3131" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FF3131" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    stroke="#ffffff20" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#ffffff20" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#121212', border: '1px solid #ffffff10', borderRadius: '8px' }}
                    itemStyle={{ color: '#FF3131' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="equity" 
                    stroke="#FF3131" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorEquity)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side Metrics */}
          <div className="space-y-6">
            <div className="twa-card">
              <h3 className="font-bold mb-6 flex items-center space-x-2">
                <Activity size={18} className="text-twa-red" />
                <span>Risk Metrics</span>
              </h3>
              <div className="space-y-6">
                {[
                  { label: 'Consistency Score', value: 88, color: 'bg-twa-red' },
                  { label: 'Risk Adjusted Return', value: 92, color: 'bg-twa-green' },
                  { label: 'Win Rate', value: 64, color: 'bg-twa-red' },
                  { label: 'Profit Factor', value: 75, color: 'bg-twa-red' },
                ].map((metric, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-white/40 uppercase tracking-widest">{metric.label}</span>
                      <span className="font-bold">{metric.value}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={`h-full ${metric.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="twa-card border-twa-red/20 bg-twa-red/5">
              <h3 className="font-bold mb-4 flex items-center space-x-2">
                <AlertCircle size={18} className="text-twa-red" />
                <span>Rule Reminders</span>
              </h3>
              <ul className="space-y-3 text-sm text-white/60">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-twa-red mt-1.5" />
                  <span>Max daily drawdown: 5%</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-twa-red mt-1.5" />
                  <span>Minimum trading days: 10</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-twa-red mt-1.5" />
                  <span>No news trading allowed</span>
                </li>
              </ul>
              <button className="mt-6 text-xs text-twa-red font-bold uppercase tracking-widest flex items-center hover:underline">
                View Full Rulebook <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
