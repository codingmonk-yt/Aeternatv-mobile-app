import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NetworkErrorScreenProps {
  onRetry: () => void;
  onGoOffline?: () => void;
  title?: string;
  message?: string;
}

const { width, height } = Dimensions.get('window');

export const NetworkErrorScreen: React.FC<NetworkErrorScreenProps> = ({
  onRetry,
  onGoOffline,
  title = "No Internet Connection",
  message = "Please check your internet connection and try again."
}) => {
  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.wifiIconContainer}>
            <MaterialIcons name="wifi-off" size={80} color="#ff6b6b" />
          </View>
          <View style={styles.signalBars}>
            {[...Array(4)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.signalBar,
                  { 
                    height: 20 + index * 8,
                    opacity: 0.3,
                    backgroundColor: '#ff6b6b'
                  }
                ]}
              />
            ))}
          </View>
        </View>

        {/* Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Try these steps:</Text>
            <View style={styles.tipItem}>
              <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
              <Text style={styles.tipText}>Check your Wi-Fi or mobile data</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
              <Text style={styles.tipText}>Move to an area with better signal</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
              <Text style={styles.tipText}>Restart your internet connection</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <MaterialIcons name="refresh" size={20} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          
          {onGoOffline && (
            <TouchableOpacity style={styles.offlineButton} onPress={onGoOffline}>
              <MaterialIcons name="offline-bolt" size={20} color="#420000" />
              <Text style={styles.offlineButtonText}>Go Offline</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    maxWidth: width * 0.9,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  wifiIconContainer: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  signalBar: {
    width: 6,
    borderRadius: 3,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  tipsContainer: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#CCCCCC',
    flex: 1,
  },
  actionsContainer: {
    width: '100%',
    gap: 12,
  },
  retryButton: {
    backgroundColor: '#420000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  offlineButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    gap: 8,
  },
  offlineButtonText: {
    color: '#420000',
    fontSize: 16,
    fontWeight: '600',
  },
});


