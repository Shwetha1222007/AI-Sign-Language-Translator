import { motion } from 'framer-motion';
import { Zap, Eye, Volume2, BarChart3, Shield, Smartphone } from 'lucide-react';
import { Card } from '../common';

export const FeaturesSection = () => {
  const features = [
    {
      icon: Eye,
      title: 'Real-Time Detection',
      description: 'Detect and translate sign language gestures in milliseconds using MediaPipe vision algorithms.',
      badge: 'Sub-50ms',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Zap,
      title: 'Lightning Fast AI',
      description: 'Ultra-low latency inference engine ensures seamless live camera stream translation without lag.',
      badge: '60 FPS',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Volume2,
      title: 'Text & Audio Speech',
      description: 'Convert signs instantly into readable text and natural spoken audio with Web Speech Synthesis.',
      badge: 'Audio Voice',
      color: 'from-emerald-400 to-teal-500',
    },
    {
      icon: BarChart3,
      title: 'Confidence Scoring',
      description: 'View precise probability and confidence scores for every detected gesture in real-time.',
      badge: '99.8% Max',
      color: 'from-amber-400 to-orange-500',
    },
    {
      icon: Shield,
      title: 'Private & Secure',
      description: 'Local browser processing options guarantee your camera feed stays private and safe.',
      badge: 'Encrypted',
      color: 'from-indigo-500 to-purple-600',
    },
    {
      icon: Smartphone,
      title: 'Cross-Platform',
      description: 'Runs fluidly across desktop, laptop, tablet, and mobile browsers with responsive design.',
      badge: 'Universal',
      color: 'from-pink-500 to-rose-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
            Next-Gen Capabilities for <br className="hidden md:inline" />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Seamless Sign Communication
            </span>
          </h2>
          <p className="text-neutral-400 text-lg md:text-xl max-w-3xl mx-auto font-normal leading-relaxed">
            Cutting-edge AI computer vision combined with an ultra-intuitive glassmorphic interface.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full group hover:border-accent-blue/40 relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-0.5 shadow-glow-sm group-hover:scale-110 transition-transform duration-300`}>
                        <div className="w-full h-full bg-primary-950/90 rounded-[14px] flex items-center justify-center">
                          <Icon className="text-white" size={26} />
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full glass border border-white/10 text-neutral-300">
                        {feature.badge}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-accent-blue transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/5 flex items-center text-xs font-mono text-accent-blue group-hover:translate-x-1 transition-transform">
                    Learn capability &rarr;
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;

