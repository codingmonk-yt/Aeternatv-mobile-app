import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { getResponsiveSpacing, responsiveStyles } from '../../../utils/responsive';

interface OfflineScreenProps {
  message?: string;
  onRetry?: () => void;
}

const offlineImage = require('../../../../assets/illustrations/no-internet-connection.png');

export default function OfflineScreen({ 
  message = "You're currently offline. Please check your internet connection and try again.",
  onRetry 
}: OfflineScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.illustrationContainer}>
          <Image 
            source={offlineImage} 
            style={{
              width: getResponsiveSpacing(160), 
              height: getResponsiveSpacing(160)
            }}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>No Internet Connection</Text>
        <Text style={styles.message}>{message}</Text>
        {onRetry && (
          <Text style={styles.retryText} onPress={onRetry}>
            Tap to retry
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: getResponsiveSpacing(20),
  },
  content: {
    alignItems: 'center',
    maxWidth: getResponsiveSpacing(300),
  },
  illustrationContainer: {
    marginBottom: getResponsiveSpacing(24),
    opacity: 0.8,
  },
  title: {
    ...responsiveStyles.title,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: getResponsiveSpacing(16),
  },
  message: {
    ...responsiveStyles.body,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: getResponsiveSpacing(24),
    marginBottom: getResponsiveSpacing(24),
  },
  retryText: {
    ...responsiveStyles.caption,
    color: '#6B46C1',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
