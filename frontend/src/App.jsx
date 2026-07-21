import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar, Footer } from './components/common';
import { HomePage, TranslatorPage, HistoryPage, SettingsPage, AboutPage } from './pages';

function App() {
  return (
    <BrowserRouter>
      <div className="bg-primary-950 text-white min-h-screen flex flex-col">
        <Navbar />
        
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/translator" element={<TranslatorPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </AnimatePresence>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
