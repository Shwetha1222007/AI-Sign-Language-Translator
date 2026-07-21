import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Translator', path: '/translator' },
    { name: 'History', path: '/history' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 bg-primary-950/80 backdrop-blur-xl border-b border-primary-800/50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center font-bold">
            AI
          </div>
          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-white">SignSpeak</h1>
            <p className="text-xs text-accent-blue">AI Translator</p>
          </div>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-accent-blue'
                    : 'text-neutral-400 hover:text-white'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-primary-900/95 backdrop-blur-xl border-t border-primary-800/50 px-6 py-4"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block py-3 text-sm font-medium transition-all ${
                  isActive
                    ? 'text-accent-blue'
                    : 'text-neutral-400 hover:text-white'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
