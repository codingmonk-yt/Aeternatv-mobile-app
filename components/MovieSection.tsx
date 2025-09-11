import React, { useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface Movie {
  id: number;
  title: string;
  poster: string;
  year?: number;
  rating?: number;
  genre?: string;
  isNewEpisode?: boolean;
  isTop10?: boolean;
  badge?: string;
}

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  onMoviePress?: (movie: Movie) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = 140;
const cardSpacing = 12;

export default function MovieSection({ title, movies, onMoviePress }: MovieSectionProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollX, setScrollX] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollX(event.nativeEvent.contentOffset.x);
  };

  const renderMovieCard = (movie: Movie, index: number) => (
    <TouchableOpacity
      key={movie.id}
      style={[
        styles.movieCard,
        { marginLeft: index === 0 ? 16 : 0 }
      ]}
      onPress={() => onMoviePress?.(movie)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: movie.poster }}
        style={styles.poster}
        resizeMode="cover"
        onError={() => console.log('Image load error for:', movie.title)}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Section Title */}
      <Text style={styles.sectionTitle}>{title}</Text>
      
      {/* Horizontal ScrollView */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={cardWidth + cardSpacing}
        snapToAlignment="start"
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {movies.map((movie, index) => renderMovieCard(movie, index))}
        
        {/* Add some padding at the end */}
        <View style={{ width: 16 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    marginLeft: 16,
    fontFamily: 'Inter',
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingRight: 0,
  },
  movieCard: {
    width: cardWidth,
    height: 200, // Fixed uniform height
    marginRight: cardSpacing,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  poster: {
    width: '100%',
    height: '100%', // Fill the entire card
    backgroundColor: '#2A2A2A',
  },
});
