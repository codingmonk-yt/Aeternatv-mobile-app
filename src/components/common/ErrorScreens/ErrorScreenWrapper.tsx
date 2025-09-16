import React from 'react';
import { StyleSheet } from 'react-native';
import { useNetworkStatus } from '../../../hooks/useNetworkStatus';
import OfflineScreen from './OfflineScreen';
import ServerErrorScreen from './ServerErrorScreen';

interface ErrorScreenWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
  error?: any;
  onRetry?: () => void;
  serverErrorMessage?: string;
  offlineMessage?: string;
}

export default function ErrorScreenWrapper({
  children,
  isLoading = false,
  error,
  onRetry,
  serverErrorMessage,
  offlineMessage,
}: ErrorScreenWrapperProps) {
  const { isConnected } = useNetworkStatus();

  // Show offline screen if not connected
  if (!isConnected) {
    return (
      <OfflineScreen 
        message={offlineMessage}
        onRetry={onRetry}
      />
    );
  }

  // Show server error screen if there's an error and we're connected
  if (error && !isLoading) {
    return (
      <ServerErrorScreen 
        message={serverErrorMessage}
        onRetry={onRetry}
      />
    );
  }

  // Show loading or content
  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
