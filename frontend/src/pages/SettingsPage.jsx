import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Zap, Volume2, Eye } from 'lucide-react';
import { Card, Button, Input, Badge } from '../components/common';
import { getModelInfo } from '../api';

export const SettingsPage = () => {
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    confidenceThreshold: 0.6,
    autoSpeak: false,
    saveHistory: true,
  });

  useEffect(() => {
    loadModelInfo();
  }, []);

  const loadModelInfo = async () => {
    try {
      const response = await getModelInfo();
      setModelInfo(response.data);
    } catch (error) {
      console.error('Failed to load model info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

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
              Settings & Preferences
            </span>
          </h1>
          <p className="text-neutral-400">Customize your translation experience</p>
        </motion.div>

        {/* Model Status */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <div className="w-8 h-8 border-3 border-accent-blue border-t-transparent rounded-full"></div>
            </div>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <Card>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                      <Zap className="text-accent-blue" /> AI Model Status
                    </h2>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-neutral-400">
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">Model Name</p>
                    <p className="font-semibold text-white">{modelInfo?.model_name || 'SignSpeak AI'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">Framework</p>
                    <p className="font-semibold text-white">{modelInfo?.framework || 'TensorFlow'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">Status</p>
                    <p className="font-semibold text-accent-blue">{modelInfo?.status || 'Ready'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">Supported Signs</p>
                    <p className="font-semibold text-white">{modelInfo?.supported_classes?.length || 50}+</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Translation Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <Card>
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Eye className="text-accent-blue" /> Translation Settings
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center justify-between mb-3">
                      <span className="text-white font-medium">Confidence Threshold</span>
                      <span className="text-accent-blue font-semibold">{(settings.confidenceThreshold * 100).toFixed(0)}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.confidenceThreshold}
                      onChange={(e) => handleSettingChange('confidenceThreshold', parseFloat(e.target.value))}
                      className="w-full h-2 bg-primary-800 rounded-lg appearance-none cursor-pointer accent-accent-blue"
                    />
                    <p className="text-sm text-neutral-400 mt-2">Only translations above this confidence will be accepted</p>
                  </div>

                  <div className="border-t border-primary-800/50 pt-6">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="text-white font-medium flex items-center gap-2">
                          <Volume2 size={18} /> Auto Speak Translation
                        </p>
                        <p className="text-sm text-neutral-400">Read translations aloud automatically</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.autoSpeak}
                        onChange={(e) => handleSettingChange('autoSpeak', e.target.checked)}
                        className="w-6 h-6 accent-accent-blue cursor-pointer"
                      />
                    </label>
                  </div>

                  <div className="border-t border-primary-800/50 pt-6">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="text-white font-medium">Save Translation History</p>
                        <p className="text-sm text-neutral-400">Keep a record of all translations</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.saveHistory}
                        onChange={(e) => handleSettingChange('saveHistory', e.target.checked)}
                        className="w-6 h-6 accent-accent-blue cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-4"
            >
              <Button size="lg" className="flex-1">
                Save Changes
              </Button>
              <Button variant="outline" size="lg" className="flex-1">
                Reset to Default
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </motion.main>
  );
};

export default SettingsPage;
