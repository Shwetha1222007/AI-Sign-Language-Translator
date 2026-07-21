import { motion } from 'framer-motion';
import { Card } from '../components/common';

export const AboutPage = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-primary-950 pt-24 pb-12"
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              About SignSpeak AI
            </span>
          </h1>
          <p className="text-neutral-400">Breaking language barriers with AI-powered sign language translation</p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card>
            <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
            <p className="text-lg text-neutral-300 leading-relaxed">
              SignSpeak AI is dedicated to making communication more accessible for deaf and hard of hearing communities. 
              By leveraging cutting-edge artificial intelligence and computer vision, we enable real-time translation of sign language 
              to English, breaking down communication barriers and fostering inclusion.
            </p>
          </Card>
        </motion.div>

        {/* How it Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card>
            <h2 className="text-3xl font-semibold mb-6">How It Works</h2>
            <div className="space-y-4">
              {[
                {
                  step: '1',
                  title: 'Camera Capture',
                  description: 'Point your webcam at a sign language gesture'
                },
                {
                  step: '2',
                  title: 'AI Processing',
                  description: 'Our advanced neural network analyzes the gesture in real-time'
                },
                {
                  step: '3',
                  title: 'Translation',
                  description: 'The gesture is translated to English text'
                },
                {
                  step: '4',
                  title: 'Output',
                  description: 'View the translation with confidence score and audio option'
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex gap-4 p-4 bg-primary-800/50 rounded-lg"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-neutral-400">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Technology */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <Card>
            <h2 className="text-3xl font-semibold mb-6">Technology Stack</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { name: 'MediaPipe', description: 'Hand pose detection and tracking' },
                { name: 'TensorFlow', description: 'Deep learning model training' },
                { name: 'React', description: 'Modern web application frontend' },
                { name: 'FastAPI', description: 'High-performance backend API' },
              ].map((tech, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-primary-800/50 rounded-lg border border-accent-blue/20"
                >
                  <h3 className="font-semibold text-accent-blue mb-1">{tech.name}</h3>
                  <p className="text-neutral-400">{tech.description}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <h2 className="text-3xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-neutral-400 mb-6">
              Have feedback, questions, or want to contribute? We'd love to hear from you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="mailto:hello@signspeak.ai" className="px-6 py-3 rounded-lg bg-gradient-primary text-white font-semibold hover:shadow-glow-md transition-all inline-block">
                Email Us
              </a>
              <a href="#" className="px-6 py-3 rounded-lg border border-accent-blue/50 text-accent-blue font-semibold hover:border-accent-blue transition-all inline-block">
                Visit GitHub
              </a>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.main>
  );
};

export default AboutPage;
