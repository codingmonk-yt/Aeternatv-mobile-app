import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getResponsiveSpacing, responsiveStyles } from '../src/utils/responsive';

export interface MovieItem {
  id: number;
  title: string;
  platform: string;
  type?: string;
  subtitle?: string;
  releaseDate?: string;
  progress?: number;
  image: string;
}

interface MovieCardProps {
  item: MovieItem;
  onPress?: (item: MovieItem) => void;
  variant?: 'default' | 'carousel' | 'grid';
  style?: any;
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  item, 
  onPress, 
  variant = 'default',
  style 
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress(item);
    }
  };

  const getCardStyle = () => {
    switch (variant) {
      case 'carousel':
        return [styles.movieCard, styles.carouselCard, style];
      case 'grid':
        return [styles.movieCard, styles.gridCard, style];
      default:
        return [styles.movieCard, styles.defaultCard, style];
    }
  };

  return (
    <TouchableOpacity 
      style={getCardStyle()} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.movieImage}
        onError={(error) => console.log('Image load error:', error)}
        onLoad={() => console.log('Image loaded successfully')}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.movieGradient}
      >
        <View style={styles.movieContent}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {item.title}
          </Text>
          {item.subtitle && (
            <Text style={styles.movieSubtitle} numberOfLines={1}>
              {item.subtitle}
            </Text>
          )}
          <Text style={styles.moviePlatform}>{item.platform}</Text>
          {item.type && <Text style={styles.movieType}>{item.type}</Text>}
          {item.releaseDate && <Text style={styles.movieDate}>{item.releaseDate}</Text>}
        </View>
        {item.progress !== undefined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${item.progress * 100}%` }]} />
            </View>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  movieCard: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333333',
  },
  carouselCard: {
    width: 150,
    height: 237.7012939453125,
    marginHorizontal: 7.5, // cardSpacing / 2
  },
  gridCard: {
    width: '100%',
    height: 200,
    marginBottom: 15,
  },
  defaultCard: {
    width: 150,
    height: 237.7012939453125,
    marginRight: 15,
    backgroundColor: '#333333', // Temporary background to test visibility
  },
  movieImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  movieGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: getResponsiveSpacing(12),
  },
  movieContent: {
    marginBottom: getResponsiveSpacing(8),
  },
  movieTitle: {
    fontFamily: 'Inter',
    fontSize: responsiveStyles.caption.fontSize,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: getResponsiveSpacing(2),
  },
  movieSubtitle: {
    fontFamily: 'Inter',
    fontSize: responsiveStyles.small.fontSize,
    color: '#cccccc',
    marginBottom: getResponsiveSpacing(2),
  },
  moviePlatform: {
    fontFamily: 'Inter',
    fontSize: responsiveStyles.tiny.fontSize,
    color: '#ff6b6b',
    fontWeight: '600',
  },
  movieType: {
    fontFamily: 'Inter',
    fontSize: responsiveStyles.tiny.fontSize,
    color: '#ffffff',
    marginTop: getResponsiveSpacing(2),
  },
  movieDate: {
    fontFamily: 'Inter',
    fontSize: responsiveStyles.tiny.fontSize,
    color: '#ffffff',
    marginTop: getResponsiveSpacing(2),
  },
  progressContainer: {
    marginTop: getResponsiveSpacing(8),
  },
  progressBar: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 1,
  },
});

export default MovieCard;
