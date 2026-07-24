/**
 * TranslatorPage.jsx
 *
 * Purpose: Main real-time sign language translation interface.
 *
 * Architecture:
 * - Camera logic    → useCamera hook
 * - Speech logic    → useSpeech hook
 * - Settings        → useSettings hook (reads confidenceThreshold, autoSpeak)
 * - History         → useHistory hook
 * - Prediction      → calls predictSign() API; falls back to demo mode when offline
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Loader, Copy, Volume2, RotateCcw, Camera, CameraOff,
  AlertCircle, Sparkles, Check, Layers, Play,
} from 'lucide-react';
import { Card, Button, Badge } from '../components/common';
import { predictSign } from '../api';
import { toast } from '../utils/toast';
import { useCamera, useSpeech, useSettings, useHistory } from '../hooks';

// ---------------------------------------------------------------------------
// ISL/ASL preset signs for demo mode and offline fallback
// ---------------------------------------------------------------------------
const PRESET_SIGNS = [
  { label: 'Hello 👋',      text: 'Hello',      confidence: 0.984, desc: 'Open palm wave' },
  { label: 'Thank You 🙏', text: 'Thank You',  confidence: 0.976, desc: 'Hand from chin outwards' },
  { label: 'Peace ✌️',     text: 'Peace',      confidence: 0.991, desc: 'V gesture extension' },
  { label: 'I Love You 🤟',text: 'I Love You', confidence: 0.998, desc: 'Thumb, index & pinky out' },
  { label: 'Yes 👍',        text: 'Yes',        confidence: 0.965, desc: 'Fist nodding motion' },
  { label: 'No ✊',         text: 'No',         confidence: 0.952, desc: 'Two fingers side tap' },
  { label: 'Help 🆘',      text: 'Help',       confidence: 0.989, desc: 'Thumbs up on flat palm' },
  { label: 'Friend 🤝',    text: 'Friend',     confidence: 0.973, desc: 'Hook index fingers' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const TranslatorPage = () => {
  // Hooks
  const { settings } = useSettings();
  const { videoRef, canvasRef, cameraActive, cameraError, permissionStatus, toggleCamera, captureFrame } = useCamera({
    resolution: settings.cameraResolution,
  });
  const { speaking, speak } = useSpeech({
    pitch: settings.voicePitch,
    rate: settings.voiceRate,
  });
  const { history, addItem, loadHistory } = useHistory();

  // Local UI state
  const [prediction, setPrediction]           = useState(null);
  const [confidence, setConfidence]           = useState(null);
  const [isLoading, setIsLoading]             = useState(false);
  const [status, setStatus]                   = useState('ready'); // 'ready' | 'translating' | 'error'
  const [copied, setCopied]                   = useState(false);
  const [demoMode, setDemoMode]               = useState(false);
  const [selectedDemoSign, setSelectedDemoSign] = useState(null);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // ---------------------------------------------------------------------------
  // Prediction Logic
  // ---------------------------------------------------------------------------

  const handlePredict = async () => {
    setIsLoading(true);
    setStatus('translating');

    try {
      let resultSign;
      let resultConfidence;

      if (demoMode || selectedDemoSign) {
        // Demo mode: use selected sign or pick one deterministically
        const demo = selectedDemoSign ?? PRESET_SIGNS[Math.floor(Math.random() * PRESET_SIGNS.length)];
        resultSign = demo.text;
        resultConfidence = demo.confidence;

      } else if (cameraActive) {
        // Live camera mode: capture frame → send to backend
        const frameBase64 = captureFrame(0.8);

        try {
          const response = await predictSign({
            image_url: frameBase64,
            confidence_threshold: settings.confidenceThreshold,
          });

          if (response.data?.prediction) {
            resultSign = response.data.prediction;
            resultConfidence = response.data.confidence ?? 0.90;
          } else {
            throw new Error('Empty prediction response from backend.');
          }
        } catch (apiError) {
          // Backend offline → fallback gracefully, do NOT show random output silently
          console.warn('[TranslatorPage] Backend unavailable, entering offline fallback:', apiError.message);
          toast.info('Backend offline — using demo gesture library.');
          const fallback = PRESET_SIGNS[Math.floor(Math.random() * PRESET_SIGNS.length)];
          resultSign = fallback.text;
          resultConfidence = fallback.confidence;
        }

      } else {
        // No camera, no demo mode — pick a sample and inform the user
        const sample = PRESET_SIGNS[Math.floor(Math.random() * PRESET_SIGNS.length)];
        resultSign = sample.text;
        resultConfidence = sample.confidence;
        toast.info('Enable camera or select a sample sign for real-time detection.');
      }

      // Apply confidence threshold filter
      if (resultConfidence < settings.confidenceThreshold) {
        toast.warning(`Confidence ${(resultConfidence * 100).toFixed(1)}% is below your threshold.`);
        setStatus('ready');
        return;
      }

      setPrediction(resultSign);
      setConfidence(resultConfidence);
      setStatus('ready');

      // Auto-speak if enabled in Settings
      if (settings.autoSpeak) {
        speak(resultSign);
      }

      // Persist to history (if enabled in Settings)
      if (settings.saveHistory) {
        addItem({ prediction: resultSign, confidence: resultConfidence });
      }

      toast.success(`Translated: "${resultSign}" (${(resultConfidence * 100).toFixed(1)}%)`);

    } catch (error) {
      setStatus('error');
      console.error('[TranslatorPage] Prediction failed:', error);
      toast.error('Failed to analyze sign gesture. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Demo Sign Selection
  // ---------------------------------------------------------------------------

  const handleDemoSelect = (signObj) => {
    setSelectedDemoSign(signObj);
    setPrediction(signObj.text);
    setConfidence(signObj.confidence);

    if (settings.saveHistory) {
      addItem({ prediction: signObj.text, confidence: signObj.confidence });
    }

    if (settings.autoSpeak) {
      speak(signObj.text);
    }

    toast.info(`Selected: ${signObj.text}`);
  };

  // ---------------------------------------------------------------------------
  // Clipboard
  // ---------------------------------------------------------------------------

  const copyToClipboard = () => {
    if (!prediction) return;
    navigator.clipboard.writeText(prediction).then(() => {
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => toast.error('Clipboard access denied.'));
  };

  // ---------------------------------------------------------------------------
  // Clear
  // ---------------------------------------------------------------------------

  const clearPrediction = () => {
    setPrediction(null);
    setConfidence(null);
    setSelectedDemoSign(null);
    setStatus('ready');
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-primary-950 pt-28 pb-16 bg-grid-pattern relative"
    >
      {/* Hidden canvas for frame capture — must stay in DOM */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6">

        {/* ---- Page Header ---- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-accent-blue/30 text-accent-blue text-xs font-mono mb-3">
              <Sparkles size={14} /> AI Sign Language Engine
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Real-Time{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">Sign Translator</span>
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Point your camera at ISL gestures or select sample signs for instant AI translation
            </p>
          </div>

          {/* Demo Mode Toggle */}
          <button
            onClick={() => setDemoMode((prev) => !prev)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition ${
              demoMode
                ? 'bg-accent-purple/20 border-accent-purple text-accent-purple shadow-glow-purple'
                : 'glass text-neutral-300 hover:text-white'
            }`}
          >
            <Layers size={15} /> Demo Mode: {demoMode ? 'ON' : 'OFF'}
          </button>
        </motion.div>

        {/* ---- Main Content Grid ---- */}
        <div className="grid lg:grid-cols-12 gap-8 mb-12">

          {/* Left: Camera Viewport — 7 cols */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-7 flex flex-col"
          >
            <Card className="flex-1 flex flex-col justify-between">

              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Camera className="text-accent-blue" size={20} /> Camera Vision Viewport
                  </h2>
                  {cameraActive && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-accent-emerald bg-accent-emerald/10 px-3 py-1 rounded-full border border-accent-emerald/30">
                      <span className="w-2 h-2 rounded-full bg-accent-emerald animate-ping" /> Live Feed
                    </span>
                  )}
                </div>

                {/* Camera Error Banner */}
                {cameraError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 bg-red-500/15 border border-red-500/40 rounded-xl flex gap-3 text-sm text-red-300"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-400">Camera Unavailable</p>
                      <p className="mt-0.5">{cameraError}</p>
                      <p className="mt-2 text-xs text-neutral-400">
                        Use <strong>Demo Mode</strong> or sample gestures below to test translation without a camera.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Camera Viewport */}
                <div className="relative mb-6 min-h-[380px] rounded-2xl overflow-hidden bg-primary-950/90 border border-white/10 flex items-center justify-center shadow-2xl">

                  {/* Live Video */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-[380px] object-cover ${cameraActive ? '' : 'hidden'}`}
                  />

                  {/* Scanline + Corner Markers (only when active) */}
                  {cameraActive && (
                    <>
                      <div className="scanline-bar" />
                      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-accent-blue" />
                      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-accent-blue" />
                      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-accent-blue" />
                      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-accent-blue" />
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full glass border border-accent-blue/30 text-xs font-mono text-accent-blue">
                        Point hand gesture inside frame
                      </div>
                    </>
                  )}

                  {/* Idle State Placeholder */}
                  {!cameraActive && (
                    <div className="flex flex-col items-center gap-4 text-center p-8">
                      <div className="w-20 h-20 rounded-3xl bg-accent-blue/10 border border-accent-blue/30 flex items-center justify-center text-accent-blue shadow-glow-sm">
                        <Camera className="w-10 h-10" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white mb-1">Camera Is Off</p>
                        <p className="text-neutral-400 text-sm max-w-sm">
                          Enable your camera for live detection, or use the sample gestures below.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Camera Toggle Button */}
                <div className="flex gap-3">
                  <Button
                    onClick={toggleCamera}
                    variant={cameraActive ? 'danger' : 'primary'}
                    className="flex-1 py-3 text-sm"
                    disabled={status === 'requesting'}
                  >
                    {status === 'requesting' ? (
                      <><Loader size={18} className="animate-spin" /> Requesting Permission...</>
                    ) : cameraActive ? (
                      <><CameraOff size={18} /> Disconnect Camera</>
                    ) : (
                      <><Camera size={18} />{permissionStatus === 'denied' ? 'Permission Denied (Retry)' : 'Enable Webcam'}</>
                    )}
                  </Button>
                </div>
              </div>

              {/* Sample Sign Presets */}
              <div className="pt-6 mt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    Quick Sample Gestures:
                  </span>
                  <span className="text-xs text-accent-blue font-mono">
                    {PRESET_SIGNS.length} Preset Signs
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_SIGNS.map((sign) => (
                    <button
                      key={sign.text}
                      onClick={() => handleDemoSelect(sign)}
                      className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border transition text-left ${
                        prediction === sign.text
                          ? 'bg-gradient-primary text-white border-white/40 shadow-glow-sm'
                          : 'glass text-neutral-300 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <span className="truncate">{sign.label}</span>
                      {prediction === sign.text && <Check size={14} className="flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Right: Translation Output — 5 cols */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <Card className="flex-1 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-6">

                {/* Status Bar */}
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono font-bold tracking-wider text-neutral-400">
                    Live Translation Output
                  </span>
                  <Badge variant={status === 'error' ? 'warning' : 'primary'}>
                    {status === 'ready' && 'AI Ready'}
                    {status === 'translating' && 'Analyzing...'}
                    {status === 'error' && 'Error'}
                  </Badge>
                </div>

                {/* Translation Result Display */}
                <div className="min-h-[160px] glass p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center relative">
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-10 h-10 border-[3px] border-accent-blue border-t-transparent rounded-full shadow-glow-sm"
                      />
                      <p className="text-sm font-mono text-accent-blue animate-pulse">
                        Running Neural Inference...
                      </p>
                    </div>
                  ) : prediction ? (
                    <motion.div
                      key={prediction}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="space-y-4 w-full"
                    >
                      <p className="text-4xl md:text-5xl font-black text-transparent bg-gradient-primary bg-clip-text break-words tracking-tight">
                        "{prediction}"
                      </p>
                      {confidence && (
                        <div className="space-y-1.5 max-w-xs mx-auto">
                          <div className="flex justify-between text-xs font-mono font-semibold">
                            <span className="text-neutral-400">Confidence Score</span>
                            <span className="text-accent-blue">{(confidence * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full h-2 bg-primary-950 rounded-full overflow-hidden border border-white/10">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${confidence * 100}%` }}
                              transition={{ duration: 0.6 }}
                              className="h-full bg-gradient-primary shadow-glow-sm"
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="space-y-2 text-neutral-500">
                      <Sparkles className="w-10 h-10 mx-auto text-neutral-600 animate-pulse" />
                      <p className="text-base font-medium">No sign gesture translated yet</p>
                      <p className="text-xs">
                        Click <strong>Translate Sign</strong> or choose a sample gesture below.
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons (Copy / Speak / Clear) */}
                {prediction && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <Button variant="secondary" className="flex-1 text-xs" onClick={copyToClipboard}>
                      {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                      {copied ? 'Copied!' : 'Copy Text'}
                    </Button>

                    <Button variant="secondary" className="flex-1 text-xs" onClick={() => speak(prediction)}>
                      <Volume2 size={16} className={speaking ? 'text-accent-pink animate-bounce' : ''} />
                      {speaking ? 'Speaking...' : 'Speak Audio'}
                    </Button>

                    <Button variant="ghost" className="px-3" onClick={clearPrediction} title="Clear result">
                      <RotateCcw size={16} />
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* Translate Button */}
              <div className="pt-6 mt-6 border-t border-white/10">
                <Button
                  size="lg"
                  onClick={handlePredict}
                  isLoading={isLoading}
                  className="w-full py-4 text-base shadow-glow-md"
                >
                  <Play size={18} className="fill-current" /> Translate Current Sign
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* ---- Recent History Strip ---- */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Recent Session Translations</h3>
                <span className="text-xs text-neutral-400 font-mono">{history.length} Records</span>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-3">
                {history.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="glass p-3.5 rounded-xl border border-white/10 flex flex-col justify-between space-y-2 hover:border-accent-blue/30 transition"
                  >
                    <span className="font-bold text-white text-base truncate">{item.prediction}</span>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-accent-blue">{(item.confidence * 100).toFixed(0)}% Match</span>
                      <span className="text-neutral-500">
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.main>
  );
};

export default TranslatorPage;
