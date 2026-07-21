import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
});

export const healthCheck = async () => api.get('/health');
export const getModelInfo = async () => api.get('/model/info');
export const predictSign = async (payload) => api.post('/predict', payload);
export const getHistory = async () => api.get('/history');
