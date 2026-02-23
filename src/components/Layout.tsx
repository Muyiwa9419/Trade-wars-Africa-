import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trophy, LayoutDashboard, Users, Info, Menu, X } from 'lucide-react';

export const Logo = ({ className = "h-10" }: { className?: string }) => (
  <div className={`flex flex-col items-center justify-center ${className}`}>
    <svg viewBox="0 0 200 120" className="h-full w-auto">
      {/* Bull Horns (Red) */}
      <path 
        d="M40 40 Q40 10 60 10 L60 20 Q50 20 50 40 L50 60 Q50 80 100 80 Q150 80 150 60 L150 40 Q150 20 140 20 L140 10 Q160 10 160 40 Q160 70 130 90 L100 110 L70 90 Q40 70 40 40" 
        fill="#FF3131" 
      />
      {/* Bull Face Bottom (Green) */}
      <path 
        d="M75 85 L85 85 L85 105 L75 100 Z" 
        fill="#8CC63F" 
      />
      <path 
        d="M125 85 L115 85 L115 105 L125 100 Z" 
        fill="#8CC63F" 
      />
    </svg>
  </div>
);

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: <Info size={18} /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={18} /> },
    { name: 'Register', path: '/register', icon: <Users size={18} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-twa-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3">
            <Logo className="h-12" />
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-[0.2em] text-white leading-none">
                TRADEWARS
              </span>
              <span className="font-display text-xs font-bold tracking-[0.5em] text-twa-green">
                AFRICA
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-twa-gold ${
                  location.pathname === link.path ? 'text-twa-gold' : 'text-white/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/register" className="twa-button-primary py-2 px-6 text-sm">
              Join Season 1
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-twa-charcoal border-b border-white/10 px-4 pt-2 pb-6 space-y-1"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-3 py-4 text-base font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg"
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
          <div className="pt-4">
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="twa-button-primary w-full block text-center"
            >
              Join Season 1
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-twa-black border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <Logo className="h-8" />
              <div className="flex flex-col">
                <span className="font-display text-sm font-bold tracking-[0.2em] text-white leading-none">
                  TRADEWARS
                </span>
                <span className="font-display text-[10px] font-bold tracking-[0.5em] text-twa-green">
                  AFRICA
                </span>
              </div>
            </Link>
            <p className="text-white/50 max-w-sm leading-relaxed">
              Africa's premier skill-based trading competition. We identify, rank, and reward the most disciplined traders across the continent.
            </p>
          </div>
          
          <div>
            <h4 className="font-display text-white font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><Link to="/leaderboard" className="hover:text-twa-red transition-colors">Leaderboard</Link></li>
              <li><Link to="/register" className="hover:text-twa-red transition-colors">Join Competition</Link></li>
              <li><Link to="/rules" className="hover:text-twa-red transition-colors">Rulebook</Link></li>
              <li><Link to="/admin" className="hover:text-twa-red transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><Link to="/terms" className="hover:text-twa-red transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-twa-red transition-colors">Privacy Policy</Link></li>
              <li><Link to="/risk" className="hover:text-twa-red transition-colors">Risk Disclosure</Link></li>
              <li><Link to="/anti-cheat" className="hover:text-twa-red transition-colors">Anti-Cheat Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-white/30">
          <p>© {new Date().getFullYear()} Trade Wars Africa. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Built for the elite. Powered by discipline.</p>
        </div>
      </div>
    </footer>
  );
};
