import { motion } from 'framer-motion';
import { Zap, Eye, Volume2, BarChart3, Shield, Smartphone } from 'lucide-react';
import { Card } from '../common';

export const FeaturesSection = () => {
  const features = [
    {
      icon: Eye,
      title: 'Real-Time Detection',
      description: 'Detect and translate sign language in milliseconds using advanced computer vision.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Sub-100ms latency ensures smooth, real-time translation without delay.',
    },
    {
      icon: Volume2,
      title: 'Text & Audio',
      description: 'Get translations as text or hear them read aloud with natural speech synthesis.',
    },
    {
      icon: BarChart3,
      title: 'Confidence Scores',
      description: 'View AI confidence levels to understand translation certainty.',
    },
    {
      icon: Shield,
      title: 'Private & Secure',
      description: 'Your data is processed securely with full privacy protection.',
    },
    {
      icon: Smartphone,
      title: 'Works Everywhere',
      description: 'Use on desktop, tablet, or mobile with responsive design.',
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
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features for <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Seamless Translation
            </span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Cutting-edge AI technology meets intuitive design to create the best sign language translation experience.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full group">
                  <div className="w-12 h-12 rounded-lg bg-accent-blue/10 flex items-center justify-center mb-4 group-hover:bg-accent-blue/20 transition-all">
                    <Icon className="text-accent-blue" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-neutral-400">{feature.description}</p>
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
