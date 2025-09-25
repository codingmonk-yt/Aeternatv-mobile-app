import { useEffect } from 'react';
import { BackHandler } from 'react-native';

interface UseAndroidBackButtonProps {
  onBackPress: () => boolean; // Return true if handled, false to use default behavior
  enabled?: boolean;
}

/**
 * Custom hook to handle Android hardware back button
 * @param onBackPress - Function to call when back button is pressed. Return true if handled, false to use default behavior
 * @param enabled - Whether the back button handler is enabled (default: true)
 */
export const useAndroidBackButton = ({ 
  onBackPress, 
  enabled = true 
}: UseAndroidBackButtonProps) => {
  useEffect(() => {
    if (!enabled) return;

    const backAction = () => {
      return onBackPress();
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [onBackPress, enabled]);
};
