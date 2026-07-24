/**
 * useCamera.js
 *
 * Purpose: Encapsulates all webcam access logic into a reusable hook.
 * Handles: stream start/stop, permission states, error handling, frame capture.
 *
 * Exports: { videoRef, canvasRef, cameraActive, cameraError, permissionStatus, toggleCamera, captureFrame }
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { getCameraErrorMessage } from '../utils/browserSupport';

/**
 * Resolution presets mapped from user settings strings.
 */
const RESOLUTION_MAP = {
  '480p': { width: { ideal: 854 }, height: { ideal: 480 } },
  '720p': { width: { ideal: 1280 }, height: { ideal: 720 } },
  '1080p': { width: { ideal: 1920 }, height: { ideal: 1080 } },
};

/**
 * @param {Object} options
 * @param {string} [options.resolution='720p'] - Camera resolution preset key.
 */
export const useCamera = (options = {}) => {
  const { resolution = '720p' } = options;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null); // hold reference for cleanup

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null); // 'granted' | 'denied' | 'prompt' | null
  const [status, setStatus] = useState('idle'); // 'idle' | 'requesting' | 'active' | 'error'

  // Query current browser permission state on mount (non-blocking)
  useEffect(() => {
    const queryPermission = async () => {
      try {
        if (navigator.permissions) {
          const result = await navigator.permissions.query({ name: 'camera' });
          setPermissionStatus(result.state);
          result.onchange = () => setPermissionStatus(result.state);
        }
      } catch {
        // Some browsers don't support permissions.query for camera — safe to ignore
      }
    };
    queryPermission();
  }, []);

  // Stop camera and release stream on component unmount
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  /**
   * Internal: stop all media tracks and reset state.
   */
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  /**
   * Start the webcam stream.
   * Throws a user-friendly error on failure.
   */
  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Your browser does not support camera access. Try Chrome or Edge.');
    }

    const videoConstraints = RESOLUTION_MAP[resolution] || RESOLUTION_MAP['720p'];

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        ...videoConstraints,
      },
      audio: false,
    });

    streamRef.current = stream;

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [resolution]);

  /**
   * Public: toggle camera on/off.
   * @returns {Promise<void>}
   */
  const toggleCamera = useCallback(async () => {
    if (cameraActive) {
      stopStream();
      setCameraActive(false);
      setCameraError(null);
      setStatus('idle');
      return;
    }

    try {
      setStatus('requesting');
      setCameraError(null);

      await startCamera();

      setCameraActive(true);
      setPermissionStatus('granted');
      setStatus('active');
    } catch (error) {
      const message = getCameraErrorMessage(error);
      console.error('[useCamera] ❌ Error:', error.name, error.message);
      setCameraError(message);
      setCameraActive(false);
      setStatus('error');

      if (error.name === 'NotAllowedError') {
        setPermissionStatus('denied');
      }
    }
  }, [cameraActive, startCamera, stopStream]);

  /**
   * Public: capture the current video frame as a base64 JPEG string.
   * Returns null if the video is not ready.
   * @param {number} [quality=0.8] - JPEG quality (0-1)
   * @returns {string|null}
   */
  const captureFrame = useCallback((quality = 0.8) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return null;
    if (video.videoWidth === 0 || video.videoHeight === 0) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/jpeg', quality);
  }, []);

  return {
    videoRef,
    canvasRef,
    cameraActive,
    cameraError,
    permissionStatus,
    status,
    toggleCamera,
    captureFrame,
  };
};

export default useCamera;
