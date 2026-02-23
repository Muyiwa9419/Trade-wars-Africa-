import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, CreditCard, ShieldCheck, Zap, ShieldAlert } from 'lucide-react';

export const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    nickname: '',
    email: '',
    phone: '',
    platform: 'MetaTrader 5',
    broker: '',
    accountNumber: '',
    tier: 'Elite',
  });
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleConfirmPayment = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      if (res.ok) {
        setStep('success');
      } else {
        setError(data.error || 'Registration failed. Please check your details.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="twa-card max-w-md w-full text-center p-12"
        >
          <div className="w-20 h-20 bg-twa-green/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="text-twa-green" size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Registration Complete</h2>
          <p className="text-white/60 mb-8">
            Your account has been verified. You can now access your trading dashboard.
          </p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="twa-button-primary w-full"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="twa-card max-w-lg w-full p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-twa-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="text-twa-red" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Complete Your Registration</h2>
            <p className="text-white/40 text-sm">Please make a transfer of ₦25,000 to the account below to activate your competition entry.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/40 uppercase tracking-widest">Bank Name</span>
              <span className="font-bold">TradeWars Africa Bank</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/40 uppercase tracking-widest">Account Number</span>
              <span className="font-mono font-bold text-lg">0123456789</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/40 uppercase tracking-widest">Account Name</span>
              <span className="font-bold uppercase">TWA Competition Pool</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <span className="text-xs text-white/40 uppercase tracking-widest">Amount Due</span>
              <span className="text-xl font-bold text-twa-red">₦25,000.00</span>
            </div>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="p-4 bg-twa-red/10 border border-twa-red/20 rounded-lg flex items-center space-x-2 text-twa-red text-sm">
                <ShieldAlert size={16} />
                <span>{error}</span>
              </div>
            )}
            <button 
              onClick={handleConfirmPayment}
              disabled={isSubmitting}
              className="w-full twa-button-primary py-4 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>I Have Made the Transfer</span>
                </>
              )}
            </button>
            <button 
              onClick={() => setStep('form')}
              className="w-full text-white/40 text-sm hover:text-white transition-colors"
            >
              Go Back to Form
            </button>
          </div>

          <div className="mt-8 p-4 bg-twa-red/5 border border-twa-red/10 rounded-lg flex items-start space-x-3">
            <Zap className="text-twa-red flex-shrink-0" size={16} />
            <p className="text-[10px] text-white/40 leading-relaxed">
              Once you click confirm, our system will automatically verify the transaction against your registered email and nickname. This usually takes less than 2 minutes.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h1 className="text-5xl font-bold mb-6">Join the League</h1>
            <p className="text-xl text-white/50 mb-12">
              Secure your spot in Season 1. Complete the registration to begin your journey to the top of the leaderboard.
            </p>

            <div className="space-y-8">
              {[
                { icon: <ShieldCheck className="text-twa-red" />, title: 'Identity Verification', desc: 'Secure and private verification process.' },
                { icon: <Zap className="text-twa-red" />, title: 'Instant Connection', desc: 'Connect your broker account in minutes.' },
                { icon: <CreditCard className="text-twa-red" />, title: 'Secure Payment', desc: 'Integrated local and international payment options.' },
              ].map((item, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{item.title}</h3>
                    <p className="text-sm text-white/40">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-twa-red/5 border border-twa-red/20 rounded-xl">
              <h4 className="font-bold text-twa-red mb-2">Season 1 Entry Fee</h4>
              <p className="text-3xl font-display font-bold mb-4">₦25,000</p>
              <p className="text-xs text-white/40 uppercase tracking-widest">Includes full competition access + performance reporting</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="twa-card"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-twa-red transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Nickname (Unique ID)</label>
                  <input
                    required
                    type="text"
                    value={formData.nickname}
                    onChange={e => setFormData({ ...formData, nickname: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-twa-red transition-colors"
                    placeholder="e.g. AlphaTrader"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Email Address</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-twa-red transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Phone Number</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-twa-red transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Trading Platform</label>
                  <select
                    value={formData.platform}
                    onChange={e => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-twa-red transition-colors appearance-none"
                  >
                    <option>MetaTrader 5</option>
                    <option>MetaTrader 4</option>
                    <option>cTrader</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest">League Tier</label>
                  <select
                    value={formData.tier}
                    onChange={e => setFormData({ ...formData, tier: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-twa-red transition-colors appearance-none"
                  >
                    <option>Elite</option>
                    <option>Professional</option>
                    <option>Rising Star</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Broker Name</label>
                  <input
                    required
                    type="text"
                    value={formData.broker}
                    onChange={e => setFormData({ ...formData, broker: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-twa-red transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Account Number</label>
                  <input
                    required
                    type="text"
                    value={formData.accountNumber}
                    onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-twa-red transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="twa-button-primary w-full py-4 text-lg flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <span className="w-6 h-6 border-2 border-twa-black/20 border-t-twa-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Proceed to Payment</span>
                      <Zap size={20} />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-white/30 mt-4">
                  By registering, you agree to our Terms of Service and Competition Rules.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
