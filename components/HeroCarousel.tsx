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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface FeaturedMovie {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  genre: string;
  year: number;
  rating: number;
  duration: string;
  image: string;
  trailerUrl?: string;
}

interface HeroCarouselProps {
  movies: FeaturedMovie[];
  onMoviePress?: (movie: FeaturedMovie) => void;
  onPlayPress?: (movie: FeaturedMovie) => void;
}

export default function HeroCarousel({ movies, onMoviePress, onPlayPress }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoScrollInterval = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const handleMoviePress = (movie: FeaturedMovie) => {
    onMoviePress?.(movie);
  };

  const handlePlayPress = (movie: FeaturedMovie) => {
    onPlayPress?.(movie);
  };

  const renderMovieSlide = (movie: FeaturedMovie, index: number) => {
    // Define gradient backgrounds for each movie as fallback
    const gradientColors = [
      ['#1a1a2e', '#16213e', '#0f3460'] as const, // MOBLAND - Dark blue
      ['#2c1810', '#8b4513', '#654321'] as const, // ADOLESCENCE - Brown
      ['#2d1b1b', '#8b0000', '#4a0e0e'] as const, // WOLFMAN - Dark red
      ['#1a1a2e', '#16213e', '#0f3460'] as const, // EVERYTHING - Dark blue
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
          <Text style={styles.title}>{movie.title}</Text>
          {/* {movie.subtitle && (
            <Text style={styles.subtitle}>{movie.subtitle}</Text>
          )} */}
          <View style={styles.movieMeta}>
            <Text style={styles.genre}>{movie.genre}</Text>
            <Text style={styles.year}>{movie.year}</Text>
            <Text style={styles.rating}>⭐ {movie.rating}</Text>
          </View>
          {/* <Text style={styles.description} numberOfLines={3}>
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
              colors={['#A259FF', '#562199']}
              style={styles.playButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <Text style={styles.playButtonText}>▶ Play</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.infoButton}>
            <Text style={styles.infoButtonText}>ⓘ More Info</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
    );
  };

  const renderPagination = () => (
    <View style={styles.pagination}>
      {movies.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === currentIndex && styles.paginationDotActive,
          ]}
        />
      ))}
    </View>
  );

  if (movies.length === 0) {
    return null;
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
      
      {movies.length > 1 && renderPagination()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: screenHeight * 0.6, // 60% of screen height
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
     paddingHorizontal: 20,
     paddingBottom: 80,
     paddingTop: 100,
   },
  movieInfo: {
    marginBottom: 24,
  },
   title: {
     fontSize: 32,
     fontWeight: 'bold',
     color: '#ffffff',
     fontFamily: 'Inter',
     marginBottom: 8,
     textShadowColor: 'rgba(0, 0, 0, 0.9)',
     textShadowOffset: { width: 0, height: 2 },
     textShadowRadius: 6,
   },
  subtitle: {
    fontSize: 18,
    color: '#cccccc',
    fontFamily: 'Inter',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  movieMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 16,
  },
  genre: {
    fontSize: 14,
    color: '#A259FF',
    fontFamily: 'Inter',
    fontWeight: '600',
    backgroundColor: 'rgba(162, 89, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  year: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'Inter',
  },
  rating: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'Inter',
  },
  description: {
    fontSize: 16,
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
    gap: 16,
  },
  playButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  playButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'Inter',
  },
  infoButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  infoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter',
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  paginationDotActive: {
    backgroundColor: '#A259FF',
    width: 24,
  },
});
