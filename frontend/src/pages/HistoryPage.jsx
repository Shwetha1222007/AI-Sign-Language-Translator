import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Calendar, TrendingUp } from 'lucide-react';
import { Card, Button } from '../components/common';
import { getHistory } from '../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await getHistory();
      setHistory(response.data || []);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = history.map((item, index) => ({
    name: `#${index + 1}`,
    confidence: item.confidence * 100,
  })).slice(0, 10);

  const stats = {
    total: history.length,
    average: history.length > 0 
      ? (history.reduce((sum, item) => sum + item.confidence, 0) / history.length * 100).toFixed(1)
      : 0,
    highest: history.length > 0
      ? Math.max(...history.map(item => item.confidence * 100)).toFixed(1)
      : 0,
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
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Translation History
            </span>
          </h1>
          <p className="text-neutral-400">View all your past translations and performance metrics</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { label: 'Total Translations', value: stats.total, icon: Calendar },
            { label: 'Average Confidence', value: `${stats.average}%`, icon: TrendingUp },
            { label: 'Highest Confidence', value: `${stats.highest}%`, icon: TrendingUp },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ translateY: -4 }}
              >
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-neutral-400 text-sm mb-2">{stat.label}</p>
                      <p className="text-3xl font-bold text-accent-blue">{stat.value}</p>
                    </div>
                    <Icon className="w-12 h-12 text-accent-blue/30" />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Chart */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <Card>
              <h2 className="text-2xl font-semibold mb-6">Confidence Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3D3D4D" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1A1A24',
                      border: '1px solid #3D3D4D',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#00D4FF' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="confidence" 
                    stroke="#00D4FF"
                    strokeWidth={2}
                    dot={{ fill: '#A855F7' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        )}

        {/* History List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <h2 className="text-2xl font-semibold mb-6">All Translations</h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin">
                  <div className="w-8 h-8 border-3 border-accent-blue border-t-transparent rounded-full"></div>
                </div>
              </div>
            ) : history.length === 0 ? (
              <p className="text-neutral-400 py-8 text-center">No translations yet. Start translating to see your history.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {history.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-primary-800/50 rounded-lg hover:bg-primary-800 transition"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-white">{item.prediction}</p>
                      <p className="text-sm text-neutral-500">
                        {new Date(item.created_at).toLocaleDateString()} at {new Date(item.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-bold text-accent-blue">{(item.confidence * 100).toFixed(1)}%</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Trash2 size={18} />
                    </Button>
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
