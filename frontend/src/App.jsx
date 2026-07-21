import { useEffect, useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { getHistory, getModelInfo, healthCheck, predictSign } from './api';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Live Translation', path: '/translate' },
  { name: 'History', path: '/history' },
  { name: 'Settings', path: '/settings' },
  { name: 'About', path: '/about' },
];

function HomePage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-400">AI-powered communication</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">SignSpeak AI</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Translate sign language into English text in real time with a modern, accessible, and production-ready experience.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['Live webcam', 'Recognize hand signs instantly'],
          ['Confidence scoring', 'Understand model certainty'],
          ['History tracking', 'Review past translations'],
        ].map(([title, description]) => (
          <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm text-slate-600">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TranslatePage() {
  const [status, setStatus] = useState('idle');
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await getHistory();
        setHistory(response.data);
      } catch (error) {
        console.error('Unable to load history', error);
      }
    };

    loadHistory();
  }, []);

  const runPrediction = async () => {
    setStatus('loading');
    try {
      const response = await predictSign({ image_url: null, confidence_threshold: 0.6 });
      setPrediction(response.data.prediction);
      setConfidence(response.data.confidence);
      setMessage(response.data.message);
      setStatus('ready');
      setHistory((current) => [
        {
          id: Date.now(),
          prediction: response.data.prediction,
          confidence: response.data.confidence,
          created_at: new Date().toISOString(),
        },
        ...current,
      ]);
    } catch (error) {
      setStatus('error');
      setMessage('Prediction request failed. Ensure the backend is running.');
      console.error(error);
    }
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Live Translation</h2>
        <p className="mt-3 text-slate-600">Send a prediction request to the backend and view the result instantly.</p>
      </div>

      <button
        onClick={runPrediction}
        className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
      >
        {status === 'loading' ? 'Predicting…' : 'Run Prediction'}
      </button>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm font-medium text-slate-500">Status</p>
        <p className="mt-1 text-lg font-semibold text-slate-900">{status}</p>
        {prediction && <p className="mt-3 text-3xl font-semibold text-cyan-700">{prediction}</p>}
        {confidence !== null && <p className="mt-2 text-sm text-slate-600">Confidence: {confidence}</p>}
        {message && <p className="mt-2 text-sm text-slate-600">{message}</p>}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-900">Recent history</h3>
        <ul className="mt-3 space-y-2">
          {history.map((item) => (
            <li key={item.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-900">{item.prediction}</span>
                <span className="text-sm text-slate-500">{item.confidence.toFixed(2)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await getHistory();
        setHistory(response.data);
      } catch (error) {
        console.error('Unable to load history', error);
      }
    };

    loadHistory();
  }, []);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Translation History</h2>
      <p className="mt-3 text-slate-600">Recent translations are now fetched from the backend.</p>
      <ul className="mt-6 space-y-2">
        {history.map((item) => (
          <li key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-900">{item.prediction}</span>
              <span className="text-sm text-slate-500">{item.confidence.toFixed(2)}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SettingsPage() {
  const [status, setStatus] = useState('checking');
  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    const loadModelInfo = async () => {
      try {
        const response = await getModelInfo();
        setModelInfo(response.data);
        setStatus('ready');
      } catch (error) {
        setStatus('error');
        console.error(error);
      }
    };

    loadModelInfo();
  }, []);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Settings</h2>
      <p className="mt-3 text-slate-600">Model and API settings are now fetched from the backend.</p>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm font-medium text-slate-500">Backend status</p>
        <p className="mt-1 text-lg font-semibold text-slate-900">{status}</p>
        {modelInfo && (
          <div className="mt-4 space-y-1 text-sm text-slate-600">
            <p>Model: {modelInfo.model_name}</p>
            <p>Framework: {modelInfo.framework}</p>
            <p>Status: {modelInfo.status}</p>
          </div>
        )}
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">About</h2>
      <p className="mt-3 text-slate-600">SignSpeak AI combines computer vision and deep learning to translate sign language into English.</p>
    </section>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-lg font-semibold">SignSpeak AI</p>
            <p className="text-sm text-slate-500">Real-time sign translation</p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/translate" element={<TranslatePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
