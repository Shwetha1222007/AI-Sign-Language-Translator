import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HeroSection, FeaturesSection } from '../components/sections';
import { Sparkles, ArrowRight } from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-primary-950 text-white overflow-hidden relative bg-grid-pattern"
    >
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-blue/10 rounded-full filter blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="glass-card rounded-3xl p-12 md:p-16 text-center border border-white/10 relative overflow-hidden shadow-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/30 text-accent-purple text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles size={14} /> Instant Access
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight"
            >
              Ready to break <br className="hidden sm:inline" />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                language barriers?
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-neutral-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Start translating sign language to English in real-time with sub-second latency and speech output.
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/translator')}
              className="px-8 py-4 rounded-xl bg-gradient-primary text-white font-bold text-lg hover:shadow-glow-lg transition-all inline-flex items-center gap-3 cursor-pointer shadow-glow-md"
            >
              Launch Translator <ArrowRight size={20} />
            </motion.button>
          </div>
        </div>
      </section>
    </motion.main>
  );
};

export default HomePage;

