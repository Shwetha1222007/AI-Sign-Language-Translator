/**
 * useSettings.js
 *
 * Purpose: Manages application settings with localStorage persistence.
 * Single source of truth for all user preferences.
 *
 * Exports: { settings, updateSetting, saveSettings, resetSettings, isDirty }
 */

import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'signspeak_settings';

/**
 * Default application settings.
 * All fields are typed and documented.
 */
export const DEFAULT_SETTINGS = {
  /** Confidence threshold (0.0–1.0): predictions below this are ignored. */
  confidenceThreshold: 0.6,

  /** Auto-speak: read translation aloud immediately after prediction. */
  autoSpeak: false,

  /** Save to history: persist each prediction to localStorage + backend. */
  saveHistory: true,

  /** Camera resolution preset key: '480p' | '720p' | '1080p' */
  cameraResolution: '720p',

  /** Voice pitch for speech synthesis (0.5–2.0) */
  voicePitch: 1.0,

  /** Voice rate for speech synthesis (0.5–2.0) */
  voiceRate: 0.95,

  /** Theme: 'dark' (only dark mode supported currently) */
  theme: 'dark',
};

/**
 * @returns {{
 *   settings: typeof DEFAULT_SETTINGS,
 *   updateSetting: (key: string, value: any) => void,
 *   saveSettings: () => void,
 *   resetSettings: () => void,
 *   isDirty: boolean
 * }}
 */
export const useSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [savedSnapshot, setSavedSnapshot] = useState(DEFAULT_SETTINGS);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults so new keys always have values
        const merged = { ...DEFAULT_SETTINGS, ...parsed };
        setSettings(merged);
        setSavedSnapshot(merged);
      }
    } catch (err) {
      console.error('[useSettings] Failed to load settings from localStorage:', err);
    }
  }, []);

  /**
   * Update a single setting key without persisting yet.
   */
  const updateSetting = useCallback((key, value) => {
    if (!(key in DEFAULT_SETTINGS)) {
      console.warn(`[useSettings] Unknown setting key: "${key}"`);
      return;
    }
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  /**
   * Persist current settings to localStorage.
   */
  const saveSettings = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setSavedSnapshot(settings);
    } catch (err) {
      console.error('[useSettings] Failed to save settings:', err);
      throw err; // let caller handle toast
    }
  }, [settings]);

  /**
   * Reset settings to factory defaults and persist immediately.
   */
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    setSavedSnapshot(DEFAULT_SETTINGS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    } catch (err) {
      console.error('[useSettings] Failed to reset settings:', err);
    }
  }, []);

  /**
   * True if the current state differs from the last saved state.
   */
  const isDirty = JSON.stringify(settings) !== JSON.stringify(savedSnapshot);

  return {
    settings,
    updateSetting,
    saveSettings,
    resetSettings,
    isDirty,
  };
};

export default useSettings;
