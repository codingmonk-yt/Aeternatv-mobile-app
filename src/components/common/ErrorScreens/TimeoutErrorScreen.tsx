import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TimeoutErrorScreenProps {
  onRetry: () => void;
  onGoBack?: () => void;
  title?: string;
  message?: string;
}

const { width, height } = Dimensions.get('window');

export const TimeoutErrorScreen: React.FC<TimeoutErrorScreenProps> = ({
  onRetry,
  onGoBack,
  title = "Request Timeout",
  message = "The request is taking longer than expected. Please try again."
}) => {
  return (
    <LinearGradient
      colors={['#2c1810', '#8b4513', '#654321']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.clockIconContainer}>
            <MaterialIcons name="schedule" size={80} color="#ffa726" />
          </View>
          <View style={styles.loadingDots}>
            {[...Array(3)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.loadingDot,
                  {
                    animationDelay: `${index * 0.2}s`,
                  }
                ]}
              />
            ))}
          </View>
          <View style={styles.timeoutLines}>
            {[...Array(5)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.timeoutLine,
                  { 
                    width: 20 + index * 8,
                    opacity: 0.8 - index * 0.15,
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
            <Text style={styles.tipsTitle}>This might help:</Text>
            <View style={styles.tipItem}>
              <MaterialIcons name="wifi" size={16} color="#4CAF50" />
              <Text style={styles.tipText}>Check your internet connection speed</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialIcons name="refresh" size={16} color="#4CAF50" />
              <Text style={styles.tipText}>Try again with a better connection</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialIcons name="location-on" size={16} color="#4CAF50" />
              <Text style={styles.tipText}>Move closer to your router</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <MaterialIcons name="refresh" size={20} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          
          {onGoBack && (
            <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
              <MaterialIcons name="arrow-back" size={20} color="#420000" />
              <Text style={styles.backButtonText}>Go Back</Text>
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
  clockIconContainer: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 167, 38, 0.1)',
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffa726',
  },
  timeoutLines: {
    alignItems: 'center',
    gap: 3,
  },
  timeoutLine: {
    height: 2,
    backgroundColor: '#ffa726',
    borderRadius: 1,
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
  backButton: {
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
  backButtonText: {
    color: '#420000',
    fontSize: 16,
    fontWeight: '600',
  },
});


