import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useGetHeroCarouselQuery } from '../../store/api/apiSlice';
import { FeaturedContent } from '../../types';
import { getResponsivePadding, getResponsiveSpacing, responsiveStyles } from '../../utils/responsive';
import { transformHeroCarouselItems } from '../../utils/transformers';
import { ErrorMessage } from '../common/ErrorMessage';
import { LoadingSpinner } from '../common/LoadingSpinner';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface HeroCarouselProps {
  onMoviePress?: (movie: FeaturedContent) => void;
  onPlayPress?: (movie: FeaturedContent) => void;
  onMoreInfoPress?: (movie: FeaturedContent) => void;
}

export default function HeroCarousel({ onMoviePress, onPlayPress, onMoreInfoPress }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoScrollInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch hero carousel data using RTK Query
  const { data, isLoading, error, refetch } = useGetHeroCarouselQuery();

  // Transform API data to component format
  const movies = data?.data ? transformHeroCarouselItems(data.data) : [];

  // Auto-scroll functionality
  useEffect(() => {
    const startAutoScroll = () => {
      autoScrollInterval.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % movies.length;
          scrollViewRef.current?.scrollTo({
            x: nextIndex * screenWidth,
            animated: true,
          });
          return nextIndex;
        });
      }, 5000); // Change slide every 5 seconds
    };

    const stopAutoScroll = () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
        autoScrollInterval.current = null;
      }
    };

    if (movies.length > 1) {
      startAutoScroll();
    }

    return stopAutoScroll;
  }, [movies.length]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / screenWidth);
    setCurrentIndex(index);
  };

  const handleMoviePress = (movie: FeaturedContent) => {
    onMoviePress?.(movie);
  };

  const handlePlayPress = (movie: FeaturedContent) => {
    onPlayPress?.(movie);
  };

  const handleMoreInfoPress = (movie: FeaturedContent) => {
    onMoreInfoPress?.(movie);
  };

  const renderMovieSlide = (movie: FeaturedContent, index: number) => {
    // Define gradient backgrounds for each movie as fallback
    const gradientColors = [
      ['#1a1a2e', '#16213e', '#0f3460'] as const, // Dark blue
      ['#2c1810', '#8b4513', '#654321'] as const, // Brown
      ['#2d1b1b', '#8b0000', '#4a0e0e'] as const, // Dark red
      ['#1a1a2e', '#16213e', '#0f3460'] as const, // Dark blue
    ];

    return (
      <TouchableOpacity
        key={movie.id}
        style={styles.slide}
        activeOpacity={0.9}
        onPress={() => handleMoviePress(movie)}
      >
        {/* Fallback Gradient Background */}
        <LinearGradient
          colors={gradientColors[index % gradientColors.length]}
          style={styles.fallbackBackground}
        />
        
        <Image
          source={{ uri: movie.image }}
          style={styles.backgroundImage}
          resizeMode="cover"
          onLoad={() => console.log('Image loaded successfully:', movie.title)}
          onError={(error) => console.log('Image load error:', movie.title, error)}
        />
        
         {/* Gradient Overlay - blends from purple status bar at top to black at bottom */}
         <LinearGradient
           colors={['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.4)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,1)']}
           locations={[0, 0.15, 0.4, 0.7, 1]}
           style={styles.gradientOverlay}
         />
      
      {/* Content */}
      <View style={styles.content}>
        <View style={styles.movieInfo}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {movie.title}
          </Text>
          {/* {movie.subtitle && (
            <Text style={styles.subtitle}>{movie.subtitle}</Text>
          )} */}
          <View style={styles.movieMeta}>
            <Text style={styles.genre} numberOfLines={1} ellipsizeMode="tail">{movie.genre}</Text>
            <Text style={styles.year}>{movie.year}</Text>
            <Text style={styles.rating}>⭐ {movie.rating}</Text>
          </View>
          {/* <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
            {movie.description}
          </Text> */}
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => handlePlayPress(movie)}
          >
            <LinearGradient
              colors={['#420000', '#160000']}
              style={styles.playButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <Text style={styles.playButtonText}>▶ Play</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.infoButton}
            onPress={() => handleMoreInfoPress(movie)}
          >
            <Text style={styles.infoButtonText}>ⓘ More Info</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
    );
  };


  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingSpinner text="Loading featured content..." />
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        <ErrorMessage error={error} onRetry={refetch} />
      </View>
    );
  }

  // No data state
  if (movies.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No featured content available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.carousel}
      >
        {movies.map((movie, index) => renderMovieSlide(movie, index))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: screenHeight * 0.5, // 60% of screen height
    position: 'relative',
  },
  carousel: {
    flex: 1,
  },
  slide: {
    width: screenWidth,
    height: '100%',
    position: 'relative',
    backgroundColor: '#1a1a1a', // Fallback background color
  },
  fallbackBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
   content: {
     flex: 1,
     justifyContent: 'flex-end',
     paddingHorizontal: getResponsivePadding(20),
     paddingBottom: 40,
     paddingTop: 100,
   },
  movieInfo: {
    marginBottom: getResponsiveSpacing(24),
  },
   title: {
     fontSize: responsiveStyles.title.fontSize * 1.2, // Slightly larger for hero
     fontWeight: 'bold',
     color: '#ffffff',
     fontFamily: 'Inter',
     marginBottom: getResponsiveSpacing(8),
     textShadowColor: 'rgba(0, 0, 0, 0.9)',
     textShadowOffset: { width: 0, height: 2 },
     textShadowRadius: 6,
   },
  subtitle: {
    fontSize: responsiveStyles.subtitle.fontSize,
    color: '#cccccc',
    fontFamily: 'Inter',
    marginBottom: getResponsiveSpacing(12),
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  movieMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveSpacing(2),
    gap: getResponsiveSpacing(16),
  },
  genre: {
    fontSize: responsiveStyles.caption.fontSize,
    color: '#420000',
    fontFamily: 'Inter',
    fontWeight: '600',
    backgroundColor: 'rgba(216, 216, 216, 0.45)',
    paddingHorizontal: getResponsivePadding(8),
    paddingVertical: getResponsivePadding(4),
    borderRadius: getResponsiveSpacing(4),
    maxWidth: 120,
  },
  year: {
    fontSize: responsiveStyles.caption.fontSize,
    color: '#ffffff',
    fontFamily: 'Inter',
  },
  rating: {
    fontSize: responsiveStyles.caption.fontSize,
    color: '#ffffff',
    fontFamily: 'Inter',
  },
  description: {
    fontSize: responsiveStyles.body.fontSize,
    color: '#ffffff',
    fontFamily: 'Inter',
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveSpacing(16),
  },
  playButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  playButtonGradient: {
    paddingHorizontal: getResponsivePadding(24),
    paddingVertical: getResponsivePadding(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    fontSize: responsiveStyles.body.fontSize,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'Inter',
  },
  infoButton: {
    paddingHorizontal: getResponsivePadding(20),
    paddingVertical: getResponsivePadding(12),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  infoButtonText: {
    fontSize: responsiveStyles.body.fontSize,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter',
  },
  noDataText: {
    fontSize: 18,
    color: '#CCCCCC',
    textAlign: 'center',
    marginTop: 50,
  },
});