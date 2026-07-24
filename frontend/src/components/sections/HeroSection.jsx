import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Eye, Play, Sparkles, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import { Button } from '../common';

export const HeroSection = () => {
  const navigate = useNavigate();
  const [activeDemoGesture, setActiveDemoGesture] = useState('Hello');

  const demoGestures = [
    { sign: '👋', text: 'Hello', confidence: 99.4, desc: 'Open palm wave gesture' },
    { sign: '🙏', text: 'Thank You', confidence: 98.7, desc: 'Hand to chin outwards' },
    { sign: '✌️', text: 'Peace', confidence: 99.1, desc: 'V sign extension' },
    { sign: '🤟', text: 'I Love You', confidence: 99.8, desc: 'Thumb, index & pinky out' },
  ];

  const currentGesture = demoGestures.find(g => g.text === activeDemoGesture) || demoGestures[0];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  return (
    <section className="min-h-screen flex items-center justify-center pt-32 pb-20 relative overflow-hidden">
      {/* Background Animated Light Orbs */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-accent-blue/15 rounded-full filter blur-[120px] animate-float"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-accent-purple/15 rounded-full filter blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent-pink/15 rounded-full filter blur-[120px] animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-6 text-center"
      >
        {/* Top Badge */}
        <motion.div variants={itemVariants} className="inline-block mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent-blue/40 text-accent-blue text-xs font-semibold uppercase tracking-wider shadow-glow-sm">
            <Zap size={15} className="animate-pulse text-accent-blue" />
            AI-Powered Real-Time Computer Vision
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-[1.1]"
        >
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            Break Language Barriers
          </span>
          <br />
          <span className="text-white">With Real-Time AI Signs</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-2xl text-neutral-300 mb-10 max-w-3xl mx-auto font-normal leading-relaxed"
        >
          Translate sign language gestures instantly into text and natural voice speech using MediaPipe hand tracking and neural networks.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Button size="lg" onClick={() => navigate('/translator')} className="group text-base px-8 py-4 shadow-glow-md">
            Start Live Translator <ArrowRight className="group-hover:translate-x-1.5 transition-transform" size={20} />
          </Button>
          <Button variant="secondary" size="lg" onClick={() => navigate('/about')} className="text-base px-8 py-4">
            <Play size={18} className="fill-current" /> How It Works
          </Button>
        </motion.div>

        {/* Interactive Visualizer Mockup */}
        <motion.div 
          variants={itemVariants}
          className="relative max-w-4xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-3xl blur-2xl -z-10"></div>
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
            
            {/* Top Bar inside mockup */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                <span className="text-xs font-mono text-neutral-400 ml-2">SignSpeak Vision Sandbox</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-accent-blue bg-accent-blue/10 px-3 py-1 rounded-full border border-accent-blue/20">
                <Activity size={12} className="animate-pulse" /> 60 FPS Feed
              </div>
            </div>

            {/* Main Preview Container */}
            <div className="grid md:grid-cols-12 gap-6 items-center">
              {/* Left Viewport */}
              <div className="md:col-span-7 aspect-video bg-primary-950/90 rounded-2xl border border-white/10 relative flex flex-col items-center justify-center p-6 overflow-hidden group">
                <div className="scanline-bar" />
                
                <motion.div 
                  key={currentGesture.text}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="text-center space-y-3"
                >
                  <div className="text-7xl md:text-8xl select-none filter drop-shadow-[0_0_20px_rgba(0,212,255,0.4)]">
                    {currentGesture.sign}
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/20 text-accent-blue text-xs font-mono">
                    <Eye size={14} /> Tracking 21 Hand Landmarks
                  </div>
                </motion.div>

                {/* Bounding box corners overlay */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-accent-blue" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-accent-blue" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-accent-blue" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-accent-blue" />
              </div>

              {/* Right Detection Output Panel */}
              <div className="md:col-span-5 text-left space-y-4">
                <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                  Detected Gesture Output
                </div>

                <div className="glass p-5 rounded-2xl border border-accent-blue/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold text-white tracking-tight">{currentGesture.text}</span>
                    <span className="text-xs font-bold text-accent-emerald bg-accent-emerald/10 px-2.5 py-1 rounded-full border border-accent-emerald/30">
                      {currentGesture.confidence}% Match
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-mono">{currentGesture.desc}</p>
                  
                  {/* Confidence Bar */}
                  <div className="w-full h-2 bg-primary-800 rounded-full overflow-hidden">
                    <motion.div 
                      key={currentGesture.confidence}
                      initial={{ width: 0 }}
                      animate={{ width: `${currentGesture.confidence}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full bg-gradient-primary"
                    />
                  </div>
                </div>

                {/* Interactive Demo Selector Tabs */}
                <div>
                  <div className="text-xs text-neutral-400 mb-2 font-medium">Try Sample Gestures:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {demoGestures.map((g) => (
                      <button
                        key={g.text}
                        onClick={() => setActiveDemoGesture(g.text)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition ${
                          activeDemoGesture === g.text
                            ? 'bg-gradient-primary text-white border-white/30 shadow-glow-sm'
                            : 'glass text-neutral-300 hover:text-white hover:border-white/20'
                        }`}
                      >
                        <span>{g.sign}</span>
                        <span>{g.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Stats Bar */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
        >
          {[
            { label: 'Detection Accuracy', value: '99.8%', icon: ShieldCheck, color: 'text-accent-blue' },
            { label: 'Processing Speed', value: '<50ms', icon: Zap, color: 'text-accent-purple' },
            { label: 'Supported Signs', value: '50+ ASL', icon: Sparkles, color: 'text-accent-pink' },
            { label: 'Speech Output', value: 'Real-Time', icon: CheckCircle2, color: 'text-accent-emerald' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="glass-card p-5 rounded-2xl border border-white/10 text-center space-y-1">
                <Icon className={`w-6 h-6 mx-auto ${stat.color} mb-2`} />
                <div className={`text-2xl md:text-3xl font-extrabold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-neutral-400 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

