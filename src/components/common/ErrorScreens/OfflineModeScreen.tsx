import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OfflineModeScreenProps {
  onRetry: () => void;
  onGoBack?: () => void;
  cachedContent?: any[];
  title?: string;
  message?: string;
}

const { width, height } = Dimensions.get('window');

export const OfflineModeScreen: React.FC<OfflineModeScreenProps> = ({
  onRetry,
  onGoBack,
  cachedContent = [],
  title = "You're Offline",
  message = "You're currently offline. Here's what you can still access."
}) => {
  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <View style={styles.offlineIconContainer}>
              <MaterialIcons name="cloud-off" size={80} color="#4CAF50" />
            </View>
            <View style={styles.offlineIndicators}>
              <View style={styles.offlineDot} />
              <View style={styles.offlineDot} />
              <View style={styles.offlineDot} />
            </View>
          </View>

          {/* Content */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Available Offline:</Text>
              <View style={styles.featureItem}>
                <MaterialIcons name="download" size={16} color="#4CAF50" />
                <Text style={styles.featureText}>Downloaded content</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="history" size={16} color="#4CAF50" />
                <Text style={styles.featureText}>Recently viewed content</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="favorite" size={16} color="#4CAF50" />
                <Text style={styles.featureText}>Your wishlist</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="settings" size={16} color="#4CAF50" />
                <Text style={styles.featureText}>App settings</Text>
              </View>
            </View>

            {cachedContent && cachedContent.length > 0 && (
              <View style={styles.cachedContentContainer}>
                <Text style={styles.cachedContentTitle}>Recently Viewed:</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.cachedContentScroll}
                >
                  {cachedContent.slice(0, 5).map((item, index) => (
                    <View key={index} style={styles.cachedItem}>
                      <View style={styles.cachedItemImage} />
                      <Text style={styles.cachedItemTitle} numberOfLines={2}>
                        {item.title || 'Content'}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
              <MaterialIcons name="wifi" size={20} color="#FFFFFF" />
              <Text style={styles.retryButtonText}>Check Connection</Text>
            </TouchableOpacity>
            
            {onGoBack && (
              <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
                <MaterialIcons name="arrow-back" size={20} color="#420000" />
                <Text style={styles.backButtonText}>Go Back</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  offlineIconContainer: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 50,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  offlineIndicators: {
    flexDirection: 'row',
    gap: 8,
  },
  offlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
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
  featuresContainer: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#CCCCCC',
    flex: 1,
  },
  cachedContentContainer: {
    alignSelf: 'stretch',
    marginBottom: 24,
  },
  cachedContentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  cachedContentScroll: {
    flexDirection: 'row',
  },
  cachedItem: {
    width: 120,
    marginRight: 12,
  },
  cachedItemImage: {
    width: 120,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    marginBottom: 8,
  },
  cachedItemTitle: {
    fontSize: 12,
    color: '#CCCCCC',
    textAlign: 'center',
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


