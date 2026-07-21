import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader, Copy, Volume2, RotateCcw, Camera, CameraOff } from 'lucide-react';
import { Card, Button, Badge } from '../components/common';
import { predictSign, getHistory } from '../api';

export const TranslatorPage = () => {
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('ready');
  const [history, setHistory] = useState([]);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await getHistory();
      setHistory(response.data || []);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const handlePredict = async () => {
    setIsLoading(true);
    setStatus('translating');
    try {
      const response = await predictSign({ image_url: null, confidence_threshold: 0.6 });
      setPrediction(response.data.prediction);
      setConfidence(response.data.confidence);
      setStatus('ready');
      
      // Add to history
      setHistory([
        {
          id: Date.now(),
          prediction: response.data.prediction,
          confidence: response.data.confidence,
          created_at: new Date().toISOString(),
        },
        ...history,
      ]);
    } catch (error) {
      setStatus('error');
      console.error('Prediction failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (prediction) {
      navigator.clipboard.writeText(prediction);
    }
  };

  const toggleCamera = () => {
    setCameraActive(!cameraActive);
    if (!cameraActive && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((error) => console.error('Camera error:', error));
    } else if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const clearPrediction = () => {
    setPrediction(null);
    setConfidence(null);
    setStatus('ready');
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-primary-950 pt-24 pb-12"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Real-Time Sign Translator
            </span>
          </h1>
          <p className="text-neutral-400">Point your camera at a sign language gesture to get instant translations</p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Camera Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full flex flex-col">
              <div className="flex-1 flex flex-col">
                <h2 className="text-2xl font-semibold mb-4">Camera Input</h2>
                
                {/* Camera Feed */}
                <div className="relative mb-4 flex-1 min-h-96 rounded-xl overflow-hidden bg-primary-800/50 flex items-center justify-center">
                  {cameraActive ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <Camera className="w-16 h-16 text-accent-blue/50" />
                      <p className="text-neutral-400">Enable camera to get started</p>
                    </div>
                  )}
                </div>

                {/* Camera Controls */}
                <div className="flex gap-3">
                  <Button
                    onClick={toggleCamera}
                    variant={cameraActive ? 'secondary' : 'primary'}
                    className="flex-1"
                  >
                    {cameraActive ? (
                      <>
                        <CameraOff size={18} /> Stop Camera
                      </>
                    ) : (
                      <>
                        <Camera size={18} /> Enable Camera
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Right: Translation Result */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Status Card */}
            <Card>
              <div className="mb-4">
                <Badge variant={status === 'error' ? 'warning' : 'primary'}>
                  {status === 'ready' && 'Ready'}
                  {status === 'translating' && 'Translating...'}
                  {status === 'error' && 'Error'}
                </Badge>
              </div>
              <h3 className="text-sm text-neutral-400 mb-2">Translation Result</h3>
              
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-8 h-8 border-3 border-accent-blue border-t-transparent rounded-full my-8"
                />
              ) : prediction ? (
                <div>
                  <p className="text-5xl font-bold text-accent-blue mb-4 break-words">
                    {prediction}
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1 h-2 bg-primary-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${confidence * 100}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-primary"
                      />
                    </div>
                    <span className="text-sm font-semibold text-accent-blue">
                      {(confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-neutral-500 text-lg py-8">
                  Make a sign gesture to get started...
                </p>
              )}
            </Card>

            {/* Action Buttons */}
            {prediction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={copyToClipboard}
                >
                  <Copy size={18} /> Copy
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    const utterance = new SpeechSynthesisUtterance(prediction);
                    window.speechSynthesis.speak(utterance);
                  }}
                >
                  <Volume2 size={18} /> Speak
                </Button>
                <Button
                  variant="secondary"
                  onClick={clearPrediction}
                >
                  <RotateCcw size={18} />
                </Button>
              </motion.div>
            )}

            {/* Predict Button */}
            <Button
              size="lg"
              onClick={handlePredict}
              isLoading={isLoading}
              disabled={!cameraActive}
              className="w-full"
            >
              <Loader size={20} /> Translate Sign
            </Button>
          </motion.div>
        </div>

        {/* History Section */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <h3 className="text-2xl font-semibold mb-6">Translation History</h3>
              <div className="space-y-3">
                {history.slice(0, 5).map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 bg-primary-800/50 rounded-lg hover:bg-primary-800 transition"
                  >
                    <span className="font-semibold text-white">{item.prediction}</span>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <div className="text-accent-blue font-semibold">{(item.confidence * 100).toFixed(1)}%</div>
                        <div className="text-neutral-500">{new Date(item.created_at).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  </motion.div>
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
