/**
 * SettingsPage.jsx
 *
 * Purpose: Configure AI translation preferences and inspect model/system status.
 * Uses useSettings hook for unified settings state management.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Volume2, Eye, Save, RefreshCw, Activity, Cpu, Check } from 'lucide-react';
import { Card, Button, Badge } from '../components/common';
import { getModelInfo } from '../api';
import { toast } from '../utils/toast';
import { useSettings } from '../hooks';

export const SettingsPage = () => {
  const { settings, updateSetting, saveSettings, resetSettings, isDirty } = useSettings();
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pingLatency, setPingLatency] = useState(null);

  useEffect(() => {
    loadModelInfo();
  }, []);

  const loadModelInfo = async () => {
    try {
      const response = await getModelInfo();
      setModelInfo(response.data);
    } catch {
      // Backend offline — use sensible defaults
      setModelInfo({
        model_name: 'SignSpeak ISL-Net v1.0',
        framework: 'TensorFlow 2.x / MediaPipe Hands',
        status: 'Demo Mode',
        supported_classes: new Array(8).fill(null),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    try {
      saveSettings();
      toast.success('Settings saved successfully!');
    } catch {
      toast.error('Failed to save settings. Please try again.');
    }
  };

  const handleReset = () => {
    resetSettings();
    toast.info('Settings reset to default configuration.');
  };

  const measurePing = async () => {
    const start = performance.now();
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/health`);
      const latency = Math.round(performance.now() - start);
      setPingLatency(latency);
      toast.info(`API response time: ${latency}ms`);
    } catch {
      const latency = Math.round(performance.now() - start);
      setPingLatency(latency);
      toast.warning(`Backend offline. Measured: ${latency}ms`);
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

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
          className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
              Settings &{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">Model Status</span>
            </h1>
            <p className="text-neutral-400 text-sm">
              Configure real-time translation preferences and inspect model diagnostics
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" size="sm" onClick={handleReset}>
              <RefreshCw size={16} /> Reset
            </Button>
            <Button
              variant={isDirty ? 'primary' : 'secondary'}
              size="sm"
              onClick={handleSave}
            >
              <Save size={16} /> {isDirty ? 'Save Changes*' : 'Saved'}
            </Button>
          </div>
        </motion.div>

        {/* Model Status Card */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin mb-3">
              <div className="w-8 h-8 border-[3px] border-accent-blue border-t-transparent rounded-full shadow-glow-sm" />
            </div>
            <p className="text-sm font-mono text-neutral-400">Inspecting AI model status...</p>
          </div>
        ) : (
          <>
            {/* AI Engine Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <Card>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-blue/10 border border-accent-blue/30 flex items-center justify-center text-accent-blue">
                      <Cpu size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">AI Vision Engine Status</h2>
                      <p className="text-xs text-neutral-400 font-mono">Neural Inference & Hand Tracking</p>
                    </div>
                  </div>
                  <Badge variant="success">Operational</Badge>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="glass p-4 rounded-xl border border-white/10">
                    <p className="text-xs text-neutral-400 mb-1">Model Name</p>
                    <p className="font-bold text-white text-sm truncate">
                      {modelInfo?.model_name ?? 'SignSpeak ISL-Net'}
                    </p>
                  </div>
                  <div className="glass p-4 rounded-xl border border-white/10">
                    <p className="text-xs text-neutral-400 mb-1">Framework</p>
                    <p className="font-bold text-white text-sm">{modelInfo?.framework ?? 'TensorFlow'}</p>
                  </div>
                  <div className="glass p-4 rounded-xl border border-white/10">
                    <p className="text-xs text-neutral-400 mb-1">API Latency</p>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-accent-emerald text-sm">
                        {pingLatency !== null ? `${pingLatency}ms` : '—'}
                      </p>
                      <button
                        onClick={measurePing}
                        title="Measure latency"
                        className="text-neutral-400 hover:text-white transition"
                      >
                        <Activity size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="glass p-4 rounded-xl border border-white/10">
                    <p className="text-xs text-neutral-400 mb-1">Supported Signs</p>
                    <p className="font-bold text-accent-blue text-sm">
                      {modelInfo?.supported_classes?.length ?? 8}+ Gestures
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Translation Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <Card>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Eye className="text-accent-blue" size={20} /> Translation Preferences
                </h2>

                <div className="space-y-6">

                  {/* Confidence Threshold Slider */}
                  <div className="glass p-5 rounded-xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white font-semibold text-sm">Confidence Threshold Cutoff</span>
                        <p className="text-xs text-neutral-400">
                          Ignore predictions below this probability
                        </p>
                      </div>
                      <span className="text-lg font-extrabold text-accent-blue font-mono">
                        {(settings.confidenceThreshold * 100).toFixed(0)}%
                      </span>
                    </div>
                    <input
                      id="confidenceThreshold"
                      type="range"
                      min="0.3"
                      max="0.95"
                      step="0.05"
                      value={settings.confidenceThreshold}
                      onChange={(e) => updateSetting('confidenceThreshold', parseFloat(e.target.value))}
                      className="w-full h-2 bg-primary-950 rounded-lg appearance-none cursor-pointer accent-accent-blue"
                    />
                  </div>

                  {/* Auto Speak Toggle */}
                  <div
                    className="glass p-5 rounded-xl border border-white/10 flex items-center justify-between cursor-pointer"
                    onClick={() => updateSetting('autoSpeak', !settings.autoSpeak)}
                  >
                    <div>
                      <p className="text-white font-semibold text-sm flex items-center gap-2">
                        <Volume2 size={16} className="text-accent-purple" /> Auto-Speak Audio Translations
                      </p>
                      <p className="text-xs text-neutral-400">
                        Automatically read predicted words aloud using speech synthesis
                      </p>
                    </div>
                    <input
                      id="autoSpeak"
                      type="checkbox"
                      checked={settings.autoSpeak}
                      onChange={(e) => updateSetting('autoSpeak', e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-5 h-5 accent-accent-blue cursor-pointer"
                    />
                  </div>

                  {/* Save History Toggle */}
                  <div
                    className="glass p-5 rounded-xl border border-white/10 flex items-center justify-between cursor-pointer"
                    onClick={() => updateSetting('saveHistory', !settings.saveHistory)}
                  >
                    <div>
                      <p className="text-white font-semibold text-sm">Save Translation History</p>
                      <p className="text-xs text-neutral-400">
                        Record all translations to browser history and enable CSV export
                      </p>
                    </div>
                    <input
                      id="saveHistory"
                      type="checkbox"
                      checked={settings.saveHistory}
                      onChange={(e) => updateSetting('saveHistory', e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-5 h-5 accent-accent-blue cursor-pointer"
                    />
                  </div>

                  {/* Camera Resolution */}
                  <div className="glass p-5 rounded-xl border border-white/10 space-y-3">
                    <div>
                      <span className="text-white font-semibold text-sm">Camera Resolution</span>
                      <p className="text-xs text-neutral-400">Higher resolution improves detection accuracy</p>
                    </div>
                    <div className="flex gap-2">
                      {['480p', '720p', '1080p'].map((res) => (
                        <button
                          key={res}
                          onClick={() => updateSetting('cameraResolution', res)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                            settings.cameraResolution === res
                              ? 'bg-gradient-primary text-white border-white/30 shadow-glow-sm'
                              : 'glass text-neutral-400 hover:text-white'
                          }`}
                        >
                          {res}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Voice Pitch Slider */}
                  <div className="glass p-5 rounded-xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white font-semibold text-sm">Voice Pitch</span>
                        <p className="text-xs text-neutral-400">Adjust speech synthesis pitch level</p>
                      </div>
                      <span className="text-sm font-extrabold text-accent-purple font-mono">
                        {settings.voicePitch.toFixed(1)}
                      </span>
                    </div>
                    <input
                      id="voicePitch"
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={settings.voicePitch}
                      onChange={(e) => updateSetting('voicePitch', parseFloat(e.target.value))}
                      className="w-full h-2 bg-primary-950 rounded-lg appearance-none cursor-pointer accent-accent-purple"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Bottom Action Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-4"
            >
              <Button size="lg" className="flex-1 py-4 shadow-glow-md" onClick={handleSave}>
                <Check size={18} /> {isDirty ? 'Save Settings' : 'All Saved'}
              </Button>
              <Button variant="outline" size="lg" className="flex-1 py-4" onClick={handleReset}>
                Reset Defaults
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </motion.main>
  );
};

export default SettingsPage;
