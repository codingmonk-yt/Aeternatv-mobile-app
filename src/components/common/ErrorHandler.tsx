import React, { useEffect, useState } from 'react';
import { useError } from '../../contexts/ErrorContext';
import { ErrorType, parseError } from '../../utils/errorHandler';
import {
    NetworkErrorScreen,
    OfflineModeScreen,
    ServerErrorScreen,
    TimeoutErrorScreen
} from './ErrorScreens';

interface ErrorHandlerProps {
  error: any;
  onRetry?: () => void;
  onGoBack?: () => void;
  onGoOffline?: () => void;
  cachedContent?: any[];
}

// Simple network check function
const checkNetworkStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch('https://www.google.com/favicon.ico', {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache',
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const ErrorHandler: React.FC<ErrorHandlerProps> = ({
  error,
  onRetry,
  onGoBack,
  onGoOffline,
  cachedContent,
}) => {
  const { error: errorState } = useError();
  const [isOnline, setIsOnline] = useState(true);

  // Check network status
  useEffect(() => {
    const checkStatus = async () => {
      const online = await checkNetworkStatus();
      setIsOnline(online);
    };

    checkStatus();
    
    // Check periodically
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!error && !errorState.isVisible) {
    return null;
  }

  const parsedError = error ? parseError(error) : null;
  const errorType = parsedError?.code as ErrorType || errorState.type;

  // Handle offline mode
  if (!isOnline) {
    return (
      <OfflineModeScreen
        onRetry={onRetry || (() => {})}
        onGoBack={onGoBack}
        cachedContent={cachedContent}
      />
    );
  }

  // Handle different error types
  switch (errorType) {
    case ErrorType.NETWORK:
      return (
        <NetworkErrorScreen
          onRetry={onRetry || (() => {})}
          onGoOffline={onGoOffline}
          message={parsedError?.message || errorState.message}
        />
      );

    case ErrorType.SERVER_ERROR:
      return (
        <ServerErrorScreen
          onRetry={onRetry || (() => {})}
          onGoBack={onGoBack}
          message={parsedError?.message || errorState.message}
          errorCode={parsedError?.status?.toString() || errorState.code}
        />
      );

    case ErrorType.TIMEOUT:
      return (
        <TimeoutErrorScreen
          onRetry={onRetry || (() => {})}
          onGoBack={onGoBack}
          message={parsedError?.message || errorState.message}
        />
      );

    default:
      // Fallback to server error for unknown errors
      return (
        <ServerErrorScreen
          onRetry={onRetry || (() => {})}
          onGoBack={onGoBack}
          message={parsedError?.message || errorState.message || 'An unexpected error occurred'}
          errorCode={parsedError?.status?.toString() || errorState.code}
        />
      );
  }
};
