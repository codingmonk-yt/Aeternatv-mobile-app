import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useError } from '../../../contexts/ErrorContext';
import { useNetworkStatus } from '../../../hooks/useNetworkStatus';
import { useOfflineMode } from '../../../hooks/useOfflineMode';
import { useRetry } from '../../../hooks/useRetry';
import { ErrorType, parseError } from '../../../utils/errorHandler';
import { ErrorHandler } from '../ErrorHandler';

// Mock API functions for demonstration
const mockApiCall = (shouldFail: boolean = false, errorType: string = 'NETWORK') => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        const error = new Error('Mock API Error');
        (error as any).code = errorType;
        (error as any).status = errorType === 'NETWORK' ? 0 : 500;
        reject(error);
      } else {
        resolve({ data: 'Success!' });
      }
    }, 2000);
  });
};

export const ErrorHandlingExample: React.FC = () => {
  const { showError, error } = useError();
  const { isOnline } = useNetworkStatus();
  const { isOfflineMode, cachedContent } = useOfflineMode();
  const [data, setData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { retry, isRetrying, canRetry, attempt } = useRetry({
    maxRetries: 3,
    initialDelay: 1000,
    onRetry: (attempt) => console.log(`Retry attempt ${attempt}`),
    onMaxRetriesReached: () => {
      showError(ErrorType.SERVER_ERROR, 'Max retries reached. Please try again later.');
    },
  });

  const handleSuccessCall = async () => {
    setIsLoading(true);
    try {
      const result = await mockApiCall(false);
      setData('API call successful!');
      console.log('Success:', result);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNetworkError = async () => {
    setIsLoading(true);
    try {
      await retry(() => mockApiCall(true, 'NETWORK'));
      setData('Network call successful after retry!');
    } catch (error) {
      const parsedError = parseError(error);
      showError(parsedError.code as ErrorType, parsedError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServerError = async () => {
    setIsLoading(true);
    try {
      await retry(() => mockApiCall(true, 'SERVER_ERROR'));
      setData('Server call successful after retry!');
    } catch (error) {
      const parsedError = parseError(error);
      showError(parsedError.code as ErrorType, parsedError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeoutError = async () => {
    setIsLoading(true);
    try {
      await retry(() => mockApiCall(true, 'TIMEOUT'));
      setData('Timeout call successful after retry!');
    } catch (error) {
      const parsedError = parseError(error);
      showError(parsedError.code as ErrorType, parsedError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearError = () => {
    setData(null);
  };

  // Show error handler if there's an error or offline mode
  if (error.isVisible || !isOnline) {
    return (
      <ErrorHandler
        error={error.isVisible ? error : null}
        onRetry={() => {
          if (error.type === ErrorType.NETWORK) {
            handleNetworkError();
          } else if (error.type === ErrorType.SERVER_ERROR) {
            handleServerError();
          } else if (error.type === ErrorType.TIMEOUT) {
            handleTimeoutError();
          }
        }}
        onGoBack={() => console.log('Go back pressed')}
        onGoOffline={() => console.log('Go offline pressed')}
        cachedContent={cachedContent}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Error Handling Demo</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Network: {isOnline ? 'Online' : 'Offline'}
        </Text>
        <Text style={styles.statusText}>
          Offline Mode: {isOfflineMode ? 'Yes' : 'No'}
        </Text>
        <Text style={styles.statusText}>
          Cached Content: {cachedContent.length} items
        </Text>
      </View>

      {data && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>{data}</Text>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearError}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.successButton]} 
          onPress={handleSuccessCall}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Loading...' : 'Test Success'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.networkButton]} 
          onPress={handleNetworkError}
          disabled={isLoading || isRetrying}
        >
          <Text style={styles.buttonText}>
            {isRetrying ? `Retrying... (${attempt})` : 'Test Network Error'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.serverButton]} 
          onPress={handleServerError}
          disabled={isLoading || isRetrying}
        >
          <Text style={styles.buttonText}>
            {isRetrying ? `Retrying... (${attempt})` : 'Test Server Error'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.timeoutButton]} 
          onPress={handleTimeoutError}
          disabled={isLoading || isRetrying}
        >
          <Text style={styles.buttonText}>
            {isRetrying ? `Retrying... (${attempt})` : 'Test Timeout Error'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Features Demonstrated:</Text>
        <Text style={styles.infoText}>• Network connectivity detection</Text>
        <Text style={styles.infoText}>• Smart retry with exponential backoff</Text>
        <Text style={styles.infoText}>• Different error screens for different error types</Text>
        <Text style={styles.infoText}>• Offline mode with cached content</Text>
        <Text style={styles.infoText}>• Global error state management</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  statusContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  statusText: {
    color: '#CCCCCC',
    fontSize: 14,
    marginBottom: 4,
  },
  successContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  successText: {
    color: '#4CAF50',
    fontSize: 16,
    flex: 1,
  },
  clearButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  clearButtonText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  successButton: {
    backgroundColor: '#4CAF50',
  },
  networkButton: {
    backgroundColor: '#FF6B6B',
  },
  serverButton: {
    backgroundColor: '#FF9800',
  },
  timeoutButton: {
    backgroundColor: '#9C27B0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 8,
  },
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    color: '#CCCCCC',
    fontSize: 14,
    marginBottom: 4,
  },
});


