/**
 * useSpeech.js
 *
 * Purpose: Wraps the browser's Web Speech API (SpeechSynthesis) into a hook.
 * Handles: speaking, cancelling, voice selection, pitch and rate options.
 *
 * Exports: { speaking, supported, speak, cancel }
 */

import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * @param {Object} options
 * @param {number} [options.rate=0.95]    - Speech rate (0.5–2.0)
 * @param {number} [options.pitch=1.0]   - Speech pitch (0.5–2.0)
 * @returns {{
 *   speaking: boolean,
 *   supported: boolean,
 *   speak: (text: string) => void,
 *   cancel: () => void
 * }}
 */
export const useSpeech = (options = {}) => {
  const { rate = 0.95, pitch = 1.0 } = options;

  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  // Check if Web Speech API is available in this browser
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Cancel any ongoing speech when the component using this hook unmounts
  useEffect(() => {
    return () => {
      if (supported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [supported]);

  /**
   * Speak a given text string aloud.
   * Cancels any currently playing speech before starting.
   * @param {string} text - The text to read aloud.
   */
  const speak = useCallback(
    (text) => {
      if (!supported) {
        console.warn('[useSpeech] SpeechSynthesis is not supported in this browser.');
        return;
      }

      if (!text || typeof text !== 'string' || text.trim() === '') {
        console.warn('[useSpeech] speak() called with empty or invalid text.');
        return;
      }

      // Cancel previous utterance cleanly
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text.trim());
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = 1.0;
      utterance.lang = 'en-US';

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = (event) => {
        console.error('[useSpeech] SpeechSynthesis error:', event.error);
        setSpeaking(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [supported, rate, pitch]
  );

  /**
   * Stop any currently playing speech immediately.
   */
  const cancel = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, [supported]);

  return {
    speaking,
    supported,
    speak,
    cancel,
  };
};

export default useSpeech;
