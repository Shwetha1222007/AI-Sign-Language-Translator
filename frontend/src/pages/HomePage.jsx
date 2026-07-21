import { motion } from 'framer-motion';
import { HeroSection, FeaturesSection } from '../components/sections';

export const HomePage = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-primary-950 text-white overflow-hidden"
    >
      <HeroSection />
      <FeaturesSection />
      
      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Ready to break language barriers?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            delay={0.2}
            className="text-xl text-neutral-400 mb-8"
          >
            Start translating sign language to English in real-time.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-lg bg-gradient-primary text-white font-semibold hover:shadow-glow-md transition-all"
          >
            Launch Translator →
          </motion.button>
        </div>
      </section>
    </motion.main>
  );
};

export default HomePage;
