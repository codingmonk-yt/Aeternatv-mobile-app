import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect } from 'react';

/**
 * Hook to lock screen orientation to portrait
 * This ensures all screens except video player remain in portrait mode
 */
export function useOrientationLock() {
  useEffect(() => {
    const lockToPortrait = async () => {
      try {
        // Lock orientation to portrait
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      } catch (error) {
        console.warn('Failed to lock orientation to portrait:', error);
      }
    };

    lockToPortrait();

    // Cleanup function to unlock when component unmounts
    return () => {
      const unlockOrientation = async () => {
        try {
          await ScreenOrientation.unlockAsync();
        } catch (error) {
          console.warn('Failed to unlock orientation:', error);
        }
      };
      unlockOrientation();
    };
  }, []);
}

/**
 * Hook to allow landscape orientation (for video player)
 * This should only be used in the video player screen
 */
export function useLandscapeOrientation() {
  useEffect(() => {
    const lockToLandscape = async () => {
      try {
        // Lock orientation to landscape
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } catch (error) {
        console.warn('Failed to lock orientation to landscape:', error);
      }
    };

    lockToLandscape();

    // Cleanup function to return to portrait when component unmounts
    return () => {
      const returnToPortrait = async () => {
        try {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        } catch (error) {
          console.warn('Failed to return to portrait orientation:', error);
        }
      };
      returnToPortrait();
    };
  }, []);
}


