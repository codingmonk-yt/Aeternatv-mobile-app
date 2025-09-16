import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Section } from '../types';
import { getResponsiveCardWidth, getResponsiveSpacing, responsiveStyles } from '../utils/responsive';

const { width } = Dimensions.get('window');
const itemWidth = getResponsiveCardWidth(); // Responsive card width based on screen size

interface SectionComponentProps {
  section: Section;
  onMoviePress: (movie: any) => void;
}

interface MovieItemProps {
  movie: any;
  onPress: () => void;
}

function MovieItem({ movie, onPress }: MovieItemProps) {
  const [imageError, setImageError] = useState(false);
  
  // Get the best available image URL
  const imageUrl = movie.stream_icon;
  
  // Check if image URL is valid (not empty or just whitespace)
  const hasValidImage = imageUrl && imageUrl.trim() !== '';
  
  // Reset image error when movie changes
  React.useEffect(() => {
    setImageError(false);
  }, [movie._id]);
  
  return (
    <TouchableOpacity style={styles.movieItem} onPress={onPress} activeOpacity={0.8}>
      {hasValidImage && !imageError ? (
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.movieImage}
          onError={() => {
            setImageError(true);
            console.log('Image failed to load for movie:', movie.title || movie.name);
          }}
        />
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderIcon}>🎬</Text>
          <Text style={styles.placeholderText} numberOfLines={2}>
            {movie.title || movie.name}
          </Text>
        </View>
      )}
      <View style={styles.movieOverlay}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {movie.title || movie.name}
        </Text>
        {movie.year && movie.year !== '0' && movie.year !== 'null' && (
          <Text style={styles.movieYear}>{movie.year}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function SectionComponent({ section, onMoviePress }: SectionComponentProps) {
  // Get all movies from all categories in this section
  const allMovies = section.categoryMovies.reduce((acc, categoryMovies) => {
    return [...acc, ...categoryMovies.movies];
  }, [] as any[]);

  const renderMovieItem = ({ item }: { item: any }) => (
    <MovieItem
      movie={item}
      onPress={() => onMoviePress(item)}
    />
  );

  // Don't render section if no movies
  if (allMovies.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {/* <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity> */}
        </View>
        {/* {section.description && (
          <Text style={styles.sectionDescription}>{section.description}</Text>
        )} */}
      </View>
      
      <FlatList
        data={allMovies}
        renderItem={renderMovieItem}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalMoviesContainer}
        ItemSeparatorComponent={() => <View style={{ width: getResponsiveSpacing(16) }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: getResponsiveSpacing(32),
  },
  sectionHeader: {
    paddingHorizontal: getResponsiveSpacing(20),
    marginBottom: getResponsiveSpacing(16),
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getResponsiveSpacing(4),
  },
  sectionTitle: {
    fontSize: responsiveStyles.subtitle.fontSize,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: 'rgba(66, 0, 0, 0.2)',
  },
  viewAllText: {
    fontSize: 12,
    color: '#420000',
    fontWeight: '600',
  },
  sectionDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  horizontalMoviesContainer: {
    paddingHorizontal: getResponsiveSpacing(20),
    paddingRight: getResponsiveSpacing(40), // Extra padding for better scrolling experience
  },
  movieItem: {
    width: itemWidth,
    borderRadius: 8,
    overflow: 'hidden',
  },
  movieImage: {
    width: '100%',
    height: itemWidth * 1.5, // 3:2 aspect ratio
    backgroundColor: '#2a2a2a',
  },
  placeholderContainer: {
    width: '100%',
    height: itemWidth * 1.5,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 8,
  },
  placeholderIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 12,
  },
  movieOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: getResponsiveSpacing(6),
  },
  movieTitle: {
    fontSize: responsiveStyles.small.fontSize,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: getResponsiveSpacing(2),
  },
  movieYear: {
    fontSize: responsiveStyles.tiny.fontSize,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
