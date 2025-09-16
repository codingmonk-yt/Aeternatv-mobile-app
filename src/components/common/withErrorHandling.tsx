import React, { ComponentType, useEffect } from 'react';
import { useError } from '../../contexts/ErrorContext';
import { ErrorType, parseError } from '../../utils/errorHandler';
import { ErrorHandler } from './ErrorHandler';

interface WithErrorHandlingProps {
  error?: any;
  onRetry?: () => void;
  onGoBack?: () => void;
  onGoOffline?: () => void;
  cachedContent?: any[];
  showErrorScreen?: boolean;
}

export function withErrorHandling<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  const WithErrorHandlingComponent = (props: P & WithErrorHandlingProps) => {
    const {
      error,
      onRetry,
      onGoBack,
      onGoOffline,
      cachedContent,
      showErrorScreen = true,
      ...restProps
    } = props;

    const { error: errorState, showError, setRetryHandler } = useError();

    // Set up retry handler
    useEffect(() => {
      if (onRetry) {
        setRetryHandler(onRetry);
      }
    }, [onRetry, setRetryHandler]);

    // Handle error display
    useEffect(() => {
      if (error && showErrorScreen) {
        const parsedError = parseError(error);
        showError(
          parsedError.code as ErrorType,
          parsedError.message,
          parsedError.status?.toString(),
          parsedError.status
        );
      }
    }, [error, showError, showErrorScreen]);

    // Show error screen if there's an error
    if ((error || errorState.isVisible) && showErrorScreen) {
      return (
        <ErrorHandler
          error={error}
          onRetry={onRetry}
          onGoBack={onGoBack}
          onGoOffline={onGoOffline}
          cachedContent={cachedContent}
        />
      );
    }

    return <WrappedComponent {...(restProps as P)} />;
  };

  WithErrorHandlingComponent.displayName = `withErrorHandling(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithErrorHandlingComponent;
}
