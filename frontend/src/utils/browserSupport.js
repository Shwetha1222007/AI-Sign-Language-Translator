/**
 * Browser Support and Camera Permission Utilities
 * Provides functionality to check browser capabilities and manage camera permissions
 */

export const checkCameraSupport = async () => {
  const support = {
    mediaDevices: !!navigator.mediaDevices,
    getUserMedia: !!(navigator.mediaDevices?.getUserMedia),
    permissions: !!navigator.permissions?.query,
  };

  // Try to check current permission status
  if (support.permissions) {
    try {
      const result = await navigator.permissions.query({ name: 'camera' });
      support.permissionState = result.state; // 'granted', 'prompt', or 'denied'
    } catch (error) {
      console.log('Could not check permission state:', error);
    }
  }

  return support;
};

export const requestCameraPermission = async () => {
  try {
    // This will trigger the browser permission dialog
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    // If we get here, permission was granted
    // Stop the stream immediately since we're just checking
    stream.getTracks().forEach((track) => track.stop());

    return {
      granted: true,
    };
  } catch (error) {
    return {
      granted: false,
      error: error.name,
      message: error.message,
    };
  }
};

/**
 * Get human-readable error message for camera errors
 */
export const getCameraErrorMessage = (error) => {
  if (error.name === 'NotAllowedError') {
    return 'Camera permission denied. Please enable camera access in your browser settings and refresh the page.';
  } else if (error.name === 'NotFoundError') {
    return 'No camera device found. Please check that your computer has a camera and it is not being used by another application.';
  } else if (error.name === 'NotReadableError') {
    return 'Camera is already in use by another application. Please close other apps using the camera and try again.';
  } else if (error.name === 'OverconstrainedError') {
    return 'Camera does not support the required resolution. Try using a different camera or reducing video quality.';
  } else if (error.name === 'TypeError') {
    return 'Camera request failed. Please check your browser permissions and try again.';
  } else if (error.message?.includes('Permission denied')) {
    return 'Camera permission denied. Check your browser and system settings.';
  }
  return `Camera error: ${error.message || 'Unknown error'}`;
};

/**
 * Get user-friendly permission status text
 */
export const getPermissionStatusText = (permissionState) => {
  switch (permissionState) {
    case 'granted':
      return 'Camera access granted';
    case 'denied':
      return 'Camera access denied';
    case 'prompt':
      return 'Camera access pending';
    default:
      return 'Unknown permission status';
  }
};
