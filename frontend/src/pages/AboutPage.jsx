import { motion } from 'framer-motion';
import { Sparkles, Layers, Cpu, Code2, Globe, Heart, ArrowRight } from 'lucide-react';
import { Card, Button } from '../components/common';
import { useNavigate } from 'react-router-dom';

export const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-primary-950 pt-28 pb-16 bg-grid-pattern"
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border border-accent-blue/30 text-accent-blue text-xs font-mono mb-4">
            <Sparkles size={14} /> Empowering Global Inclusion
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            About <span className="bg-gradient-primary bg-clip-text text-transparent">SignSpeak AI</span>
          </h1>
          <p className="text-neutral-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Pioneering accessible communication by converting sign language gestures into natural voice and text in real-time.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <Card className="relative overflow-hidden border-accent-blue/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full filter blur-3xl pointer-events-none" />
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-neutral-300 text-base leading-relaxed">
              SignSpeak AI was built with a single core mission: to bridge the communication gap between signers and non-signers worldwide. 
              Using real-time hand-pose estimation, MediaPipe landmark tracking, and custom deep learning neural networks, SignSpeak AI 
              democratizes gesture translation with instant text and audio output right inside the web browser.
            </p>
          </Card>
        </motion.div>

        {/* How it Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <Card>
            <h2 className="text-2xl font-bold text-white mb-6">4-Step Neural Pipeline</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  step: '01',
                  title: 'Vision Frame Capture',
                  description: 'Webcam feeds 60 FPS video frames into high-resolution canvas extraction.',
                  color: 'text-accent-blue border-accent-blue/30',
                },
                {
                  step: '02',
                  title: '21 Hand Landmarks',
                  description: 'MediaPipe tracks 3D spatial coordinates for joint positions and palm vectors.',
                  color: 'text-accent-purple border-accent-purple/30',
                },
                {
                  step: '03',
                  title: 'Deep Learning Model',
                  description: 'Neural classifier computes classification probabilities across gesture classes.',
                  color: 'text-accent-pink border-accent-pink/30',
                },
                {
                  step: '04',
                  title: 'Text & Speech Synthesis',
                  description: 'Results output immediately to text badges and natural voice speech synthesis.',
                  color: 'text-accent-emerald border-accent-emerald/30',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="glass p-5 rounded-2xl border border-white/10 hover:border-accent-blue/40 transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-black font-mono ${item.color}`}>{item.step}</span>
                    <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
                  </div>
                  <h3 className="font-bold text-white text-base">{item.title}</h3>
                  <p className="text-neutral-400 text-xs leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <Card>
            <h2 className="text-2xl font-bold text-white mb-6">Built With Modern Open Technology</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { name: 'React 18 & Vite', category: 'Frontend', desc: 'Ultra-fast JSX rendering and hot module reload.' },
                { name: 'MediaPipe & TensorFlow', category: 'AI Inference', desc: 'Pre-trained hand landmark estimation models.' },
                { name: 'Tailwind CSS & Glassmorphism', category: 'Design', desc: 'Futuristic glass aesthetics and glowing tokens.' },
                { name: 'Web Speech API', category: 'Audio Synthesis', desc: 'Browser native speech synthesis audio feedback.' },
              ].map((tech, index) => (
                <div key={index} className="glass p-4 rounded-xl border border-white/10 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">{tech.name}</span>
                    <span className="text-[10px] font-mono text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded-full">
                      {tech.category}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">{tech.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-10 rounded-3xl text-center border border-white/10 space-y-6"
        >
          <h2 className="text-3xl font-extrabold text-white">Experience SignSpeak AI Now</h2>
          <p className="text-neutral-300 text-sm max-w-lg mx-auto">
            Test real-time sign language translation with your webcam or sample gesture presets today.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/translator')} className="shadow-glow-md">
              Launch Sign Translator <ArrowRight size={18} />
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
};

export default AboutPage;

