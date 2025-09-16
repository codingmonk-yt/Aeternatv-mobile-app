import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { ServerErrorScreen } from '../src/components/common/ErrorScreens';
import KeyboardDismissWrapper from '../src/components/common/KeyboardDismissWrapper';
import { useDebounce } from '../src/hooks/useDebounce';
import { useMovies } from '../src/hooks/useMovies';
import { useVODCategories } from '../src/hooks/useVODCategories';
import { getResponsiveIconSize, getResponsivePadding, getResponsiveSpacing, responsiveStyles } from '../src/utils/responsive';
import MovieInfoPage from './movie-info';

const { width } = Dimensions.get('window');

// Import not-found illustration
const notFoundImage = require('../assets/illustrations/not-found.png');

// Calculate responsive card width based on available space and screen size
const getCardWidth = () => {
  const screenSize = width;
  const horizontalPadding = getResponsivePadding(20) * 2; // Left and right padding
  const gap = getResponsiveSpacing(10) * 2; // Gap between 3 cards
  const availableWidth = screenSize - horizontalPadding - gap;
  
  // Calculate base width for 3 columns
  let calculatedWidth = availableWidth / 3;
  
  // Adjust for different screen sizes
  if (screenSize <= 375) {
    // Small screens: ensure cards aren't too small
    calculatedWidth = Math.max(calculatedWidth, 90);
  } else if (screenSize <= 414) {
    // Medium screens: standard sizing
    calculatedWidth = Math.max(calculatedWidth, 100);
  } else if (screenSize <= 768) {
    // Large screens: can be larger
    calculatedWidth = Math.max(calculatedWidth, 110);
  } else {
    // XLarge screens: maximum size
    calculatedWidth = Math.max(calculatedWidth, 120);
  }
  
  return calculatedWidth;
};

// Calculate responsive header height to prevent overlap
const getHeaderHeight = () => {
  const screenSize = width;
  // Base header height calculation
  const headerPadding = getResponsiveSpacing(20) * 2; // Top and bottom padding
  const searchHeight = getResponsiveSpacing(50); // Search bar height
  const categoriesHeight = getResponsiveSpacing(50); // Categories height
  const baseHeight = headerPadding + searchHeight + categoriesHeight;
  
  // Add extra margin for smaller screens to prevent overlap
  if (screenSize <= 375) {
    return baseHeight + getResponsiveSpacing(40); // Extra margin for small screens
  } else if (screenSize <= 414) {
    return baseHeight + getResponsiveSpacing(30); // Extra margin for medium screens
  } else {
    return baseHeight + getResponsiveSpacing(20); // Standard margin for larger screens
  }
};

const cardWidth = getCardWidth();
const headerHeight = getHeaderHeight();

interface MovieCardProps {
  movie: any;
  onPress: () => void;
}

function MovieCard({ movie, onPress }: MovieCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Get the best available image URL
  const imageUrl = movie.cover_big || movie.movie_image || movie.stream_icon;
  
  // Check if image URL is valid (not empty or just whitespace)
  const hasValidImage = imageUrl && imageUrl.trim() !== '';
  
  // Reset image error when movie changes
  React.useEffect(() => {
    setImageError(false);
  }, [movie._id]);
  
  return (
    <TouchableOpacity style={styles.movieCard} onPress={onPress} activeOpacity={0.8}>
      {hasValidImage && !imageError ? (
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.movieImage}
          onError={() => {
            setImageError(true);
            console.log('Image failed to load for movie:', movie.title);
          }}
        />
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderIcon}>🎬</Text>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.movieOverlay}>
        <Text style={styles.movieTitle} numberOfLines={2}>{movie.title}</Text>
        <Text style={styles.moviePlatform}>{movie.year}</Text>
      </View>
    </TouchableOpacity>
  );
}

interface CategoryChipProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
}

interface EmptyMoviesStateProps {
  searchQuery: string;
  selectedCategory: string;
}

function EmptyMoviesState({ searchQuery, selectedCategory }: EmptyMoviesStateProps) {
  return (
    <View style={styles.emptyStateContainer}>
      <Image 
        source={notFoundImage} 
        style={styles.emptyStateImage}
        resizeMode="contain"
      />
      <Text style={styles.emptyStateTitle}>
        No movies found
      </Text>
      <Text style={styles.emptyStateMessage}>
        {searchQuery 
          ? `No movies found for "${searchQuery}"` 
          : selectedCategory !== 'All' 
            ? `No movies found in ${selectedCategory} category`
            : 'No movies available'
        }
      </Text>
    </View>
  );
}

function CategoryChip({ title, isActive, onPress }: CategoryChipProps) {
  return (
    <TouchableOpacity 
      style={[styles.chip, isActive && styles.activeChip]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, isActive && styles.activeChipText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

interface MoviesDetailsPageProps {
  onBackPress?: () => void;
  onVideoPlayerOpen?: (title?: string) => void;
}

export default function MoviesDetailsPage({ onBackPress, onVideoPlayerOpen }: MoviesDetailsPageProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMovieInfo, setShowMovieInfo] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  // Fetch VOD categories from API
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useVODCategories();
  
  // Add "All" option to categories
  const allCategories = [
    { _id: 'all', category_name: 'All', category_id: 'all' },
    ...categories
  ];
  
  // Function to get category ID for API calls (returns null for "All")
  const getCategoryIdForAPI = () => {
    if (selectedCategory === 'All') {
      return null;
    }
    const category = categories.find(cat => cat.category_name === selectedCategory);
    if (category && category.category_id) {
      // Remove leading zeros from category_id
      return category.category_id.replace(/^0+/, '') || '0';
    }
    return null;
  };

  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 1000);
  
  // Fetch movies with infinite scrolling
  const {
    movies,
    pagination,
    isLoading: moviesLoading,
    isFetching: moviesFetching,
    error: moviesError,
    hasNextPage,
    loadMore,
    refetch: refetchMovies,
    isEndReached,
  } = useMovies({
    search: debouncedSearch,
    categoryId: getCategoryIdForAPI(),
    limit: 20,
  });


  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleMoviePress = (movie: any) => {
    console.log('=== Movie Press Debug ===');
    console.log('Movie pressed:', movie.title);
    console.log('Movie object:', movie);
    console.log('Movie ID for API:', movie._id);
    console.log('Movie stream_id:', movie.stream_id);
    console.log('Movie _id:', movie._id);
    console.log('Using _id for API call:', movie._id);
    console.log('========================');
    setSelectedMovie(movie);
    setShowMovieInfo(true);
  };

  const handleMovieInfoBackPress = () => {
    setShowMovieInfo(false);
    setSelectedMovie(null);
  };

  // Log category selection for future API integration
  React.useEffect(() => {
    const categoryId = getCategoryIdForAPI();
    console.log('Selected category:', selectedCategory, 'Category ID for API:', categoryId);
  }, [selectedCategory]);

  if (showMovieInfo && selectedMovie) {
    console.log('=== Rendering MovieInfoPage ===');
    console.log('selectedMovie:', selectedMovie);
    console.log('Passing movieId:', selectedMovie._id);
    console.log('===============================');
    return <MovieInfoPage onBackPress={handleMovieInfoBackPress} movieId={selectedMovie._id} onVideoPlayerOpen={onVideoPlayerOpen} />;
  }

  return (
    <KeyboardDismissWrapper style={styles.container}>
      <LinearGradient
        colors={['#000000', '#160000', '#420000', '#160000', '#000000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.4, 0.6, 0.7, 1]}
        style={styles.gradientBackground}
      >
        {/* Sticky Header */}
        <View style={styles.stickyHeader}>
          {/* Header with back button and title */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Movies</Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>
                <Search size={getResponsiveIconSize(20)} color="#ffffff" /> 
              </Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Artists, Films, Tv shows ..."
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Category Chips */}
          <View style={styles.categoriesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categoriesLoading ? (
                <Text style={styles.loadingText}>Loading categories...</Text>
              ) : (
                allCategories.map((category) => (
                  <CategoryChip
                    key={category._id}
                    title={category.category_name}
                    isActive={selectedCategory === category.category_name}
                    onPress={() => setSelectedCategory(category.category_name)}
                  />
                ))
              )}
            </ScrollView>
          </View>
        </View>

        {/* Movies Grid with Infinite Scrolling */}
        <View style={styles.scrollableContent}>
          {moviesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#420000" />
              <Text style={styles.loadingText}>Loading movies...</Text>
            </View>
          ) : moviesError ? (
            <ServerErrorScreen 
              message="Failed to load movies. Please check your connection and try again."
              onRetry={refetchMovies}
            />
          ) : movies.length === 0 ? (
            <EmptyMoviesState 
              searchQuery={searchQuery} 
              selectedCategory={selectedCategory} 
            />
          ) : (
            <FlatList
              data={movies}
              renderItem={({ item }) => (
                <MovieCard
                  movie={item}
                  onPress={() => handleMoviePress(item)}
                />
              )}
              keyExtractor={(item, index) => `${item._id}-${index}`}
              numColumns={3}
              columnWrapperStyle={styles.moviesRow}
              contentContainerStyle={styles.moviesGrid}
              showsVerticalScrollIndicator={false}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
              ListFooterComponent={() => (
                <View style={styles.footerContainer}>
                  {moviesFetching && !moviesLoading ? (
                    <ActivityIndicator size="small" color="#420000" />
                  ) : isEndReached ? (
                    <Text style={styles.endMessage}>No more movies to load</Text>
                  ) : null}
                </View>
              )}
              // Ensure proper spacing and layout
              key={`${width}-${headerHeight}`} // Re-render when screen width or header height changes
            />
          )}
        </View>
      </LinearGradient>
    </KeyboardDismissWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    backdropFilter: 'blur(10px)',
  },
  scrollableContent: {
    flex: 1,
    marginTop: headerHeight, // Use calculated header height to prevent overlap
  },
  scrollContentContainer: {
    paddingBottom: getResponsiveSpacing(40), // Reduced from 80 to 40
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: getResponsiveSpacing(20),
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsivePadding(20),
  },
  backButton: {
    width: getResponsiveIconSize(40),
    height: getResponsiveIconSize(40),
    borderRadius: getResponsiveIconSize(20),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getResponsiveSpacing(16),
  },
  backIcon: {
    fontSize: getResponsiveIconSize(24),
    color: '#FFFFFF',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: responsiveStyles.subtitle.fontSize,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: getResponsivePadding(20),
    marginBottom: getResponsiveSpacing(16),
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: getResponsiveSpacing(12),
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(8),
  },
  searchIcon: {
    fontSize: responsiveStyles.caption.fontSize,
    marginRight: getResponsiveSpacing(12),
    color: 'rgba(255, 255, 255, 0.6)',
  },
  searchInput: {
    flex: 1,
    fontSize: responsiveStyles.body.fontSize,
    color: '#FFFFFF',
  },
  categoriesContainer: {
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsiveSpacing(16),
  },
  chip: {
    paddingHorizontal: getResponsivePadding(20),
    paddingVertical: getResponsivePadding(10),
    borderRadius: getResponsiveSpacing(20),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: getResponsiveSpacing(12),
  },
  activeChip: {
    backgroundColor: '#420000',
  },
  chipText: {
    fontSize: responsiveStyles.caption.fontSize,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  activeChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  moviesGrid: {
    paddingTop: getResponsiveSpacing(50), // Increased top padding to ensure cards are visible
    paddingBottom: getResponsivePadding(20),
  },
  movieCard: {
    width: cardWidth,
    borderRadius: getResponsiveSpacing(12),
    overflow: 'hidden',
  },
  movieImage: {
    width: '100%',
    height: cardWidth * 1.5, // 3:2 aspect ratio
    backgroundColor: '#2a2a2a',
  },
  placeholderContainer: {
    width: '100%',
    height: cardWidth * 1.5,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: getResponsiveSpacing(12),
  },
  placeholderIcon: {
    fontSize: getResponsiveIconSize(32),
    marginBottom: getResponsiveSpacing(8),
  },
  placeholderText: {
    fontSize: responsiveStyles.small.fontSize,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  movieOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: getResponsiveSpacing(8),
  },
  movieTitle: {
    fontSize: responsiveStyles.small.fontSize,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: getResponsiveSpacing(2),
  },
  moviePlatform: {
    fontSize: responsiveStyles.tiny.fontSize,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  loadingText: {
    fontSize: responsiveStyles.caption.fontSize,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: responsiveStyles.caption.fontSize,
    color: '#FF6B6B',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: getResponsiveSpacing(40),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: getResponsiveSpacing(40),
  },
  retryButton: {
    backgroundColor: '#420000',
    paddingHorizontal: getResponsivePadding(20),
    paddingVertical: getResponsivePadding(10),
    borderRadius: getResponsiveSpacing(8),
    marginTop: getResponsiveSpacing(16),
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  moviesRow: {
    justifyContent: 'space-between',
    paddingHorizontal: getResponsivePadding(20),
    marginBottom: getResponsiveSpacing(20),
    gap: getResponsiveSpacing(10),
    // Ensure proper distribution of cards
    alignItems: 'flex-start',
  },
  footerContainer: {
    paddingVertical: getResponsivePadding(20),
    alignItems: 'center',
  },
  endMessage: {
    fontSize: responsiveStyles.caption.fontSize,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: getResponsiveSpacing(60),
    paddingHorizontal: getResponsivePadding(40),
  },
  emptyStateImage: {
    width: getResponsiveSpacing(120),
    height: getResponsiveSpacing(120),
    marginBottom: getResponsiveSpacing(24),
    opacity: 0.8,
  },
  emptyStateTitle: {
    fontSize: responsiveStyles.subtitle.fontSize,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: getResponsiveSpacing(12),
  },
  emptyStateMessage: {
    fontSize: responsiveStyles.body.fontSize,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: getResponsiveSpacing(24),
  },
});
