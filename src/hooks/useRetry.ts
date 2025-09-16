import { useCallback, useRef, useState } from 'react';

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number) => void;
  onMaxRetriesReached?: () => void;
}

interface RetryState {
  isRetrying: boolean;
  attempt: number;
  maxRetries: number;
  canRetry: boolean;
}

export const useRetry = (options: RetryOptions = {}) => {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    onRetry,
    onMaxRetriesReached,
  } = options;

  const [retryState, setRetryState] = useState<RetryState>({
    isRetrying: false,
    attempt: 0,
    maxRetries,
    canRetry: true,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculateDelay = useCallback((attempt: number): number => {
    const delay = initialDelay * Math.pow(backoffMultiplier, attempt - 1);
    return Math.min(delay, maxDelay);
  }, [initialDelay, backoffMultiplier, maxDelay]);

  const retry = useCallback(async (fn: () => Promise<any>) => {
    if (retryState.attempt >= maxRetries) {
      setRetryState(prev => ({ ...prev, canRetry: false }));
      onMaxRetriesReached?.();
      return;
    }

    setRetryState(prev => ({ 
      ...prev, 
      isRetrying: true, 
      attempt: prev.attempt + 1 
    }));

    onRetry?.(retryState.attempt + 1);

    const delay = calculateDelay(retryState.attempt + 1);
    
    return new Promise((resolve, reject) => {
      timeoutRef.current = setTimeout(async () => {
        try {
          const result = await fn();
          setRetryState(prev => ({ 
            ...prev, 
            isRetrying: false,
            attempt: 0,
            canRetry: true
          }));
          resolve(result);
        } catch (error) {
          setRetryState(prev => ({ 
            ...prev, 
            isRetrying: false 
          }));
          reject(error);
        }
      }, delay);
    });
  }, [retryState.attempt, maxRetries, calculateDelay, onRetry, onMaxRetriesReached]);

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setRetryState({
      isRetrying: false,
      attempt: 0,
      maxRetries,
      canRetry: true,
    });
  }, [maxRetries]);

  const canRetry = retryState.canRetry && retryState.attempt < maxRetries;

  return {
    retry,
    reset,
    retryState,
    canRetry,
    isRetrying: retryState.isRetrying,
    attempt: retryState.attempt,
    maxRetries,
  };
};


