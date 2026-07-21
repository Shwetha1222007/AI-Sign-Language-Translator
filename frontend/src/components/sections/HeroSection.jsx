import { motion } from 'framer-motion';
import { ArrowRight, Zap, Eye, BarChart3 } from 'lucide-react';
import { Button, Card } from '../common';

export const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-blue/10 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-purple/10 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-accent-cyan/10 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-6 text-center"
      >
        {/* Badge */}
        <motion.div variants={itemVariants}>
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-sm font-medium">
              <Zap size={16} />
              AI-Powered Real-Time Translation
            </div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            Break Language Barriers
          </span>
          <br />
          <span className="text-white">With AI Sign Language</span>
        </motion.h1>

        {/* Description */}
        <motion.p 
          variants={itemVariants}
          className="text-xl text-neutral-400 mb-8 max-w-2xl mx-auto"
        >
          Real-time AI translation of sign language to English. Powered by advanced computer vision and deep learning.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Button size="lg" className="group">
            Get Started <ArrowRight className="group-hover:translate-x-1 transition" size={20} />
          </Button>
          <Button variant="outline" size="lg">
            Watch Demo
          </Button>
        </motion.div>

        {/* Hero Image/Visual */}
        <motion.div 
          variants={itemVariants}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-primary-900/50 backdrop-blur-md border border-primary-800/50 rounded-3xl p-8 md:p-12 shadow-smooth-lg">
            <div className="aspect-video bg-primary-800/50 rounded-2xl flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center"
              >
                <Eye className="w-16 h-16 mx-auto text-accent-blue mb-4" />
                <p className="text-neutral-400">Live Webcam Feed</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-3 gap-4 md:gap-8 mt-12"
        >
          {[
            { label: '99.8%', desc: 'Accuracy' },
            { label: '<100ms', desc: 'Latency' },
            { label: '50+', desc: 'Signs' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-accent-blue">{stat.label}</div>
              <div className="text-sm text-neutral-400">{stat.desc}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
