import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { ErrorType } from '../utils/errorHandler';

export interface ErrorState {
  type: ErrorType | null;
  message: string;
  code?: string;
  status?: number;
  isVisible: boolean;
  retryable: boolean;
}

interface ErrorContextType {
  error: ErrorState;
  showError: (type: ErrorType, message: string, code?: string, status?: number) => void;
  hideError: () => void;
  clearError: () => void;
  retry: () => void;
  onRetry?: () => void;
  setRetryHandler: (handler: () => void) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [error, setError] = useState<ErrorState>({
    type: null,
    message: '',
    isVisible: false,
    retryable: false,
  });
  const [onRetry, setOnRetry] = useState<(() => void) | undefined>();

  const showError = useCallback((
    type: ErrorType, 
    message: string, 
    code?: string, 
    status?: number
  ) => {
    const retryable = [
      ErrorType.NETWORK,
      ErrorType.TIMEOUT,
      ErrorType.SERVER_ERROR,
    ].includes(type);

    setError({
      type,
      message,
      code,
      status,
      isVisible: true,
      retryable,
    });
  }, []);

  const hideError = useCallback(() => {
    setError(prev => ({ ...prev, isVisible: false }));
  }, []);

  const clearError = useCallback(() => {
    setError({
      type: null,
      message: '',
      isVisible: false,
      retryable: false,
    });
  }, []);

  const retry = useCallback(() => {
    if (onRetry) {
      onRetry();
      hideError();
    }
  }, [onRetry, hideError]);

  const setRetryHandler = useCallback((handler: () => void) => {
    setOnRetry(() => handler);
  }, []);

  return (
    <ErrorContext.Provider
      value={{
        error,
        showError,
        hideError,
        clearError,
        retry,
        onRetry,
        setRetryHandler,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};


