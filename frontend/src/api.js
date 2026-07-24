/**
 * api.js
 *
 * Purpose: Centralized Axios client for all backend API calls.
 * Base URL is read from Vite env: VITE_API_BASE_URL (defaults to localhost:8000).
 *
 * All functions return Axios Promise objects.
 * Error handling is done at the call site (hooks or components).
 */

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 15000, // 15 seconds — generous for base64 image payloads
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---------------------------------------------------------------------------
// Request Interceptor — attach auth tokens in the future if needed
// ---------------------------------------------------------------------------
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// ---------------------------------------------------------------------------
// Response Interceptor — normalize errors for consistent handling
// ---------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a non-2xx status
      console.error('[API] Server error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received (server offline)
      console.warn('[API] No response from server — backend may be offline.');
    } else {
      console.error('[API] Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ---------------------------------------------------------------------------
// API Endpoints
// ---------------------------------------------------------------------------

/** @returns {Promise<import('axios').AxiosResponse<{status: string}>>} */
export const healthCheck = () => api.get('/health');

/** @returns {Promise<import('axios').AxiosResponse>} */
export const getModelInfo = () => api.get('/model/info');

/**
 * Send a frame for sign gesture prediction.
 * @param {{ image_url?: string, confidence_threshold?: number }} payload
 */
export const predictSign = (payload) => api.post('/predict', payload);

/**
 * Retrieve translation history from backend.
 * @param {number} [limit=100]
 */
export const getHistory = (limit = 100) => api.get(`/history?limit=${limit}`);

/**
 * Delete a single history record by ID.
 * @param {number|string} id
 */
export const deleteHistoryItem = (id) => api.delete(`/history/${id}`);

/**
 * Clear all history records from the backend.
 */
export const clearHistory = () => api.delete('/history');

export default api;
