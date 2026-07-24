import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Menu, X, Sparkles, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { healthCheck } from '../../api';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiOnline, setApiOnline] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        await healthCheck();
        setApiOnline(true);
      } catch (err) {
        // If server is offline, keep status indicator friendly
        setApiOnline(false);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Translator', path: '/translator' },
    { name: 'History', path: '/history' },
    { name: 'Settings', path: '/settings' },
    { name: 'About', path: '/about' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
    >
      <div className="max-w-7xl mx-auto">
        <nav className="glass rounded-2xl border border-white/10 px-6 py-3.5 flex items-center justify-between shadow-2xl backdrop-blur-xl bg-primary-950/70">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary p-0.5 shadow-glow-sm group-hover:shadow-glow-md transition-all duration-300">
                <div className="w-full h-full bg-primary-950 rounded-[10px] flex items-center justify-center font-black text-sm text-accent-blue group-hover:text-white transition">
                  <Sparkles className="w-5 h-5 text-accent-blue" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-primary-950 bg-green-500 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white tracking-tight">SignSpeak</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue border border-accent-blue/30 uppercase tracking-widest">
                  AI v2.0
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono hidden sm:block">Real-Time Sign Translation</p>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 bg-primary-900/60 p-1.5 rounded-xl border border-white/5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'text-white font-semibold shadow-glow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-primary rounded-lg -z-10 opacity-90"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    {item.name}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right Action & API Status */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-900/80 border border-white/10 text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-accent-emerald animate-pulse' : 'bg-yellow-500'}`} />
              <span className="text-neutral-300">{apiOnline ? 'API Active' : 'Demo Mode'}</span>
            </div>

            <NavLink
              to="/translator"
              className="px-5 py-2.5 rounded-xl bg-gradient-primary text-white text-sm font-semibold hover:shadow-glow-md active:scale-95 transition"
            >
              Launch App
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl bg-primary-900 border border-white/10 text-neutral-300 hover:text-white"
            aria-label="Toggle Navigation"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile Menu Drawer */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 glass rounded-2xl border border-white/10 p-4 space-y-2 bg-primary-950/90 shadow-2xl"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-primary text-white font-semibold shadow-glow-sm'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
              <span className="flex items-center gap-2">
                <Activity size={14} className="text-accent-blue" /> System Status
              </span>
              <span className="text-accent-blue font-semibold">{apiOnline ? 'Online' : 'Demo Ready'}</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Navbar;

