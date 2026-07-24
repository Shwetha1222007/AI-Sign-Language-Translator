import { motion } from 'framer-motion';
import { Mail, Share2, Globe, Sparkles, Heart, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative z-10 border-t border-white/10 bg-primary-950/80 backdrop-blur-2xl mt-24"
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary p-0.5 shadow-glow-sm">
                <div className="w-full h-full bg-primary-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-accent-blue" />
                </div>
              </div>
              <span className="font-bold text-lg text-white tracking-tight">SignSpeak AI</span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Empowering global accessibility with real-time AI-powered sign language translation and speech synthesis.
            </p>
            <div className="flex items-center gap-2 text-xs text-accent-blue font-mono">
              <span className="w-2 h-2 rounded-full bg-accent-emerald animate-ping" />
              Model v2.0 Operational
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4 text-accent-blue">Navigation</h3>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/translator" className="hover:text-white transition">Sign Translator</Link></li>
              <li><Link to="/history" className="hover:text-white transition">Translation History</Link></li>
              <li><Link to="/settings" className="hover:text-white transition">Settings & Model</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About Project</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4 text-accent-purple">Capabilities</h3>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li><span className="hover:text-white transition cursor-default">Real-Time Camera Capture</span></li>
              <li><span className="hover:text-white transition cursor-default">Text-to-Speech Engine</span></li>
              <li><span className="hover:text-white transition cursor-default">Confidence Score Gauge</span></li>
              <li><span className="hover:text-white transition cursor-default">Offline Demo Mode</span></li>
              <li><span className="hover:text-white transition cursor-default">History Export (CSV)</span></li>
            </ul>
          </div>

          {/* Social / Connect */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4 text-accent-pink">Connect</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Building open-source tools for accessibility and inclusion.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-xl glass flex items-center justify-center text-neutral-400 hover:text-accent-blue hover:border-accent-blue/50 transition"
                title="GitHub Repository"
              >
                <Code size={18} />
              </a>
              <a 
                href="https://signspeak.ai" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-xl glass flex items-center justify-center text-neutral-400 hover:text-accent-purple hover:border-accent-purple/50 transition"
                title="Official Website"
              >
                <Globe size={18} />
              </a>
              <a 
                href="mailto:contact@signspeak.ai" 
                className="w-10 h-10 rounded-xl glass flex items-center justify-center text-neutral-400 hover:text-accent-pink hover:border-accent-pink/50 transition"
                title="Email Support"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500 gap-4">
          <p className="flex items-center gap-1">
            &copy; {currentYear} SignSpeak AI. Built with <Heart size={12} className="text-red-500 fill-red-500 inline" /> for accessibility.
          </p>
          <div className="flex gap-6">
            <span className="hover:text-neutral-400 transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-neutral-400 transition cursor-pointer">Terms of Service</span>
            <span className="hover:text-neutral-400 transition cursor-pointer">ASL Guidelines</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;

