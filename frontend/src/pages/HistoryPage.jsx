/**
 * HistoryPage.jsx
 *
 * Purpose: View, search, export, and manage translation history.
 * Uses useHistory hook for dual-layer (localStorage + API) data management.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Calendar, TrendingUp, Download, Search, Award } from 'lucide-react';
import { Card, Button, Input } from '../components/common';
import { toast } from '../utils/toast';
import { useHistory } from '../hooks';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export const HistoryPage = () => {
  const { history, loading, deleteItem, clearAll, loadHistory, exportCSV } = useHistory();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  const handleDelete = async (id) => {
    await deleteItem(id);
    toast.success('Deleted record from history.');
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all translation history?')) return;
    await clearAll();
    toast.success('Cleared all translation history.');
  };

  const handleExport = () => {
    if (history.length === 0) {
      toast.warning('No history to export!');
      return;
    }
    exportCSV();
    toast.success('Downloaded history CSV report!');
  };

  // ---------------------------------------------------------------------------
  // Derived Data
  // ---------------------------------------------------------------------------

  const filteredHistory = history.filter((item) =>
    item.prediction.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = history
    .slice(0, 15)
    .reverse()
    .map((item) => ({
      name: item.prediction,
      confidence: Number((item.confidence * 100).toFixed(1)),
    }));

  const stats = {
    total: history.length,
    average:
      history.length > 0
        ? (history.reduce((sum, item) => sum + item.confidence, 0) / history.length * 100).toFixed(1)
        : 0,
    highest:
      history.length > 0
        ? Math.max(...history.map((item) => item.confidence * 100)).toFixed(1)
        : 0,
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
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
              Translation{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">History & Metrics</span>
            </h1>
            <p className="text-neutral-400 text-sm">
              Review past translations, confidence accuracy trends, and export logs
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" size="sm" onClick={handleExport} disabled={history.length === 0}>
              <Download size={16} /> Export CSV
            </Button>
            <Button variant="danger" size="sm" onClick={handleClearAll} disabled={history.length === 0}>
              <Trash2 size={16} /> Clear All
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-10"
        >
          {[
            { label: 'Total Translations Recorded', value: stats.total, icon: Calendar, color: 'text-accent-blue' },
            { label: 'Average Confidence Score',     value: `${stats.average}%`, icon: TrendingUp, color: 'text-accent-purple' },
            { label: 'Peak Prediction Accuracy',    value: `${stats.highest}%`, icon: Award,      color: 'text-accent-pink' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-400 text-xs font-mono uppercase tracking-wider mb-2">
                      {stat.label}
                    </p>
                    <p className={`text-4xl font-extrabold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl glass flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                </div>
              </Card>
            );
          })}
        </motion.div>

        {/* Confidence Trend Chart */}
        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Confidence Level Trend</h2>
                  <p className="text-xs text-neutral-400">Recent translation accuracy breakdown</p>
                </div>
                <span className="text-xs font-mono text-accent-blue bg-accent-blue/10 px-3 py-1 rounded-full border border-accent-blue/20">
                  Last {chartData.length} Signs
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="confidenceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#00D4FF" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#12121A',
                        border: '1px solid rgba(0, 212, 255, 0.3)',
                        borderRadius: '12px',
                        boxShadow: '0 0 20px rgba(0,212,255,0.2)',
                      }}
                      labelStyle={{ color: '#00D4FF', fontWeight: 'bold' }}
                      formatter={(val) => [`${val}%`, 'Accuracy']}
                    />
                    <Area
                      type="monotone"
                      dataKey="confidence"
                      stroke="#00D4FF"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#confidenceGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        )}

        {/* History Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">All Translation Logs</h2>
                <p className="text-xs text-neutral-400">Search and manage individual translation records</p>
              </div>
              <div className="w-full md:w-72">
                <Input
                  icon={Search}
                  placeholder="Filter by gesture..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="py-2 text-xs"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin mb-3">
                  <div className="w-8 h-8 border-[3px] border-accent-blue border-t-transparent rounded-full shadow-glow-sm" />
                </div>
                <p className="text-sm text-neutral-400 font-mono">Loading history entries...</p>
              </div>

            ) : filteredHistory.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
                <p className="text-neutral-400 text-base mb-2">No translation history found.</p>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  {searchTerm
                    ? 'No results matched your search term.'
                    : 'Start translating gestures in the Sign Translator to generate records.'}
                </p>
              </div>

            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {filteredHistory.map((item, index) => (
                  <motion.div
                    key={item.id ?? index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center justify-between p-4 glass rounded-xl border border-white/10 hover:border-accent-blue/40 transition group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-accent-blue/10 border border-accent-blue/30 flex items-center justify-center font-bold text-accent-blue text-sm">
                        #{filteredHistory.length - index}
                      </div>
                      <div>
                        <p className="font-bold text-lg text-white group-hover:text-accent-blue transition">
                          {item.prediction}
                        </p>
                        <p className="text-xs text-neutral-400 font-mono">
                          {new Date(item.created_at).toLocaleDateString()} at{' '}
                          {new Date(item.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className="text-sm font-bold text-accent-emerald bg-accent-emerald/10 px-3 py-1 rounded-full border border-accent-emerald/30">
                        {(item.confidence * 100).toFixed(1)}% Match
                      </span>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-xl text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition"
                        title="Delete record"
                        aria-label={`Delete ${item.prediction}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

      </div>
    </motion.main>
  );
};

export default HistoryPage;
