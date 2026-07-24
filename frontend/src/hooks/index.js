/**
 * hooks/index.js
 *
 * Purpose: Barrel export for all custom React hooks.
 * Allows clean imports: import { useCamera, useSettings } from '../hooks';
 */

export { useCamera } from './useCamera';
export { useSettings, DEFAULT_SETTINGS } from './useSettings';
export { useSpeech } from './useSpeech';
export { useHistory } from './useHistory';
