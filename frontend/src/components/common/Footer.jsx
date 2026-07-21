import { motion } from 'framer-motion';
import { Mail, Share2, Code } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-primary-950/95 backdrop-blur-xl border-t border-primary-800/50 mt-20"
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center font-bold text-sm">
                AI
              </div>
              <span className="font-bold text-white">SignSpeak</span>
            </div>
            <p className="text-neutral-400 text-sm">
              Real-time AI-powered sign language translation for accessibility.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li><a href="#" className="hover:text-accent-blue transition">Features</a></li>
              <li><a href="#" className="hover:text-accent-blue transition">Pricing</a></li>
              <li><a href="#" className="hover:text-accent-blue transition">API Docs</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li><a href="#" className="hover:text-accent-blue transition">About</a></li>
              <li><a href="#" className="hover:text-accent-blue transition">Blog</a></li>
              <li><a href="#" className="hover:text-accent-blue transition">Contact</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-white mb-4">Follow</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-primary-800 hover:bg-accent-blue/20 flex items-center justify-center text-neutral-400 hover:text-accent-blue transition">
                <Share2 size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-primary-800 hover:bg-accent-blue/20 flex items-center justify-center text-neutral-400 hover:text-accent-blue transition">
                <Code size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-primary-800 hover:bg-accent-blue/20 flex items-center justify-center text-neutral-400 hover:text-accent-blue transition">
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-800/50 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-400">
          <p>&copy; {currentYear} SignSpeak AI. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-accent-blue transition">Privacy Policy</a>
            <a href="#" className="hover:text-accent-blue transition">Terms of Service</a>
            <a href="#" className="hover:text-accent-blue transition">Cookies</a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
