import React, { useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getResponsiveSpacing, responsiveStyles } from '../src/utils/responsive';

interface SeriesCardProps {
  series: {
    _id: string;
    title: string;
    name: string;
    year: string;
    cover: string;
    backdrop_path?: string[];
    rating?: string;
    genre?: string;
  };
  onPress: () => void;
  cardWidth: number;
}

export default function SeriesCard({ series, onPress, cardWidth }: SeriesCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Get the best available image URL
  const imageUrl = series.cover || series.backdrop_path?.[0];
  
  // Check if image URL is valid (not empty or just whitespace)
  const hasValidImage = imageUrl && imageUrl.trim() !== '';
  
  // Reset image error when series changes
  React.useEffect(() => {
    setImageError(false);
  }, [series._id]);
  
  return (
    <TouchableOpacity 
      style={[styles.seriesCard, { width: cardWidth, height: cardWidth * 1.5 }]} 
      onPress={onPress} 
      activeOpacity={0.8}
    >
      {hasValidImage && !imageError ? (
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.seriesImage}
          onError={() => {
            setImageError(true);
            console.log('Image failed to load for series:', series.title);
          }}
        />
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderIcon}>📺</Text>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.seriesOverlay}>
        <Text style={styles.seriesTitle} numberOfLines={2}>
          {series.title || series.name}
        </Text>
        <Text style={styles.seriesYear}>{series.year}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  seriesCard: {
    borderRadius: getResponsiveSpacing(8),
    overflow: 'hidden',
  },
  seriesImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2a2a2a',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: getResponsiveSpacing(8),
    padding: getResponsiveSpacing(8),
  },
  placeholderIcon: {
    fontSize: getResponsiveSpacing(24),
    marginBottom: getResponsiveSpacing(8),
  },
  placeholderText: {
    fontSize: responsiveStyles.tiny.fontSize,
    fontFamily: responsiveStyles.tiny.fontFamily,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 12,
  },
  seriesOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: getResponsiveSpacing(6),
  },
  seriesTitle: {
    fontSize: responsiveStyles.small.fontSize,
    fontFamily: responsiveStyles.small.fontFamily,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: getResponsiveSpacing(2),
  },
  seriesYear: {
    fontSize: responsiveStyles.tiny.fontSize,
    fontFamily: responsiveStyles.tiny.fontFamily,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
