import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useError } from '../src/contexts/ErrorContext';
import { ErrorType } from '../src/utils/errorHandler';

export default function ErrorTestPage() {
  const { showError, error, hideError } = useError();
  const [testData, setTestData] = useState<string | null>(null);

  const testNetworkError = () => {
    showError(ErrorType.NETWORK, 'No internet connection detected');
  };

  const testServerError = () => {
    showError(ErrorType.SERVER_ERROR, 'Server is temporarily unavailable', '500');
  };

  const testTimeoutError = () => {
    showError(ErrorType.TIMEOUT, 'Request timed out after 30 seconds');
  };

  const testSuccess = () => {
    setTestData('Success! Error handling system is working correctly.');
    hideError();
  };

  const clearData = () => {
    setTestData(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Error Handling Test</Text>
      
      {testData && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>{testData}</Text>
          <TouchableOpacity style={styles.clearButton} onPress={clearData}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.networkButton]} onPress={testNetworkError}>
          <Text style={styles.buttonText}>Test Network Error</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.serverButton]} onPress={testServerError}>
          <Text style={styles.buttonText}>Test Server Error</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.timeoutButton]} onPress={testTimeoutError}>
          <Text style={styles.buttonText}>Test Timeout Error</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.successButton]} onPress={testSuccess}>
          <Text style={styles.buttonText}>Test Success</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Error Handling Features:</Text>
        <Text style={styles.infoText}>✅ Network connectivity detection</Text>
        <Text style={styles.infoText}>✅ Beautiful error screens with illustrations</Text>
        <Text style={styles.infoText}>✅ Smart retry mechanisms</Text>
        <Text style={styles.infoText}>✅ Offline mode support</Text>
        <Text style={styles.infoText}>✅ Global error state management</Text>
        <Text style={styles.infoText}>✅ No external dependencies required</Text>
      </View>
    </View>
  );
}

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
    marginBottom: 30,
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
    marginBottom: 30,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
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
  successButton: {
    backgroundColor: '#4CAF50',
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
    marginBottom: 12,
  },
  infoText: {
    color: '#CCCCCC',
    fontSize: 14,
    marginBottom: 6,
  },
});


