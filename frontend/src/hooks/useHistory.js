/**
 * useHistory.js
 *
 * Purpose: Manages translation history with dual-layer storage.
 *   Layer 1: localStorage (always available, instant reads)
 *   Layer 2: Backend API (synced when available, persists across devices)
 *
 * Design: localStorage is the primary cache. API is best-effort sync.
 * If the backend is offline, the app continues to work with local data.
 *
 * Exports: { history, loading, addItem, deleteItem, clearAll, loadHistory, exportCSV }
 */

import { useState, useCallback } from 'react';
import { getHistory, deleteHistoryItem as apiDeleteItem, clearHistory as apiClearHistory } from '../api';

const STORAGE_KEY = 'signspeak_history';
const MAX_LOCAL_HISTORY = 200; // prevent localStorage bloat

/**
 * @typedef {Object} TranslationRecord
 * @property {number|string} id
 * @property {string} prediction
 * @property {number} confidence
 * @property {string} created_at - ISO 8601 timestamp string
 */

export const useHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * Internal: write the history array to localStorage.
   * Trims to MAX_LOCAL_HISTORY to avoid storage overflow.
   * @param {TranslationRecord[]} items
   */
  const persistLocal = useCallback((items) => {
    try {
      const trimmed = items.slice(0, MAX_LOCAL_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (err) {
      console.warn('[useHistory] localStorage write failed:', err);
    }
  }, []);

  /**
   * Load history. Reads localStorage first for instant display,
   * then syncs from backend API (best-effort).
   */
  const loadHistory = useCallback(async () => {
    setLoading(true);

    // Phase 1: Load from localStorage immediately for instant UI response
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setHistory(JSON.parse(raw));
      }
    } catch (err) {
      console.warn('[useHistory] Failed to read localStorage:', err);
    }

    // Phase 2: Best-effort sync from backend API
    try {
      const response = await getHistory();
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setHistory(response.data);
        persistLocal(response.data);
      }
    } catch {
      // Backend offline is non-fatal — local data is still usable
      console.info('[useHistory] Backend sync skipped (offline). Using local cache.');
    } finally {
      setLoading(false);
    }
  }, [persistLocal]);

  /**
   * Add a new translation record to history.
   * Writes to localStorage immediately; backend save is handled by the prediction endpoint.
   * @param {Omit<TranslationRecord, 'id' | 'created_at'>} item
   */
  const addItem = useCallback(
    (item) => {
      /** @type {TranslationRecord} */
      const newRecord = {
        id: Date.now(),
        prediction: item.prediction,
        confidence: item.confidence,
        created_at: new Date().toISOString(),
      };

      setHistory((prev) => {
        const updated = [newRecord, ...prev].slice(0, MAX_LOCAL_HISTORY);
        persistLocal(updated);
        return updated;
      });
    },
    [persistLocal]
  );

  /**
   * Delete a single history item by ID.
   * Removes from state + localStorage; attempts backend delete.
   * @param {number|string} id
   */
  const deleteItem = useCallback(
    async (id) => {
      setHistory((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        persistLocal(updated);
        return updated;
      });

      // Best-effort backend delete
      try {
        await apiDeleteItem(id);
      } catch {
        console.info('[useHistory] Backend delete skipped (offline).');
      }
    },
    [persistLocal]
  );

  /**
   * Clear all history from state, localStorage, and backend.
   */
  const clearAll = useCallback(async () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn('[useHistory] localStorage clear failed:', err);
    }

    // Best-effort backend clear
    try {
      await apiClearHistory();
    } catch {
      console.info('[useHistory] Backend clear skipped (offline).');
    }
  }, []);

  /**
   * Export history as a CSV file download.
   * @param {TranslationRecord[]} [items] - Defaults to current history state.
   */
  const exportCSV = useCallback(
    (items) => {
      const data = items ?? history;
      if (data.length === 0) return;

      const headers = ['ID', 'Prediction', 'Confidence (%)', 'Timestamp'];
      const rows = data.map((item) => [
        item.id,
        `"${item.prediction}"`,
        (item.confidence * 100).toFixed(1),
        `"${new Date(item.created_at).toLocaleString()}"`,
      ]);

      const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `signspeak_history_${Date.now()}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    },
    [history]
  );

  return {
    history,
    loading,
    addItem,
    deleteItem,
    clearAll,
    loadHistory,
    exportCSV,
  };
};

export default useHistory;
