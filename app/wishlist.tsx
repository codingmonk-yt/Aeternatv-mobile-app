import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MovieCard, { MovieItem } from '../components/MovieCard';
import MovieDetailsScreen from './movie-details';
import NewReleasedPage from './new-released';


// Mock data for movies/shows with real Pexels images
const recentlyWatchedData = [
  {
    id: 1,
    title: 'MOBLAND',
    platform: 'Paramount+',
    type: 'ORIGINAL',
    progress: 0.3,
    image: 'https://images.pexels.com/photos/1200450/pexels-photo-1200450.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 2,
    title: 'ADOLESCENCE',
    platform: 'NETFLIX',
    releaseDate: 'MARCH 13',
    progress: 0.6,
    image: 'https://images.pexels.com/photos/3945317/pexels-photo-3945317.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 3,
    title: 'TITANIC',
    platform: 'DISNEY+',
    progress: 0.8,
    image: 'https://images.pexels.com/photos/3945317/pexels-photo-3945317.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

// Extended movie data with cast information for details screen
const movieDetailsData = {
  1: {
    id: 1,
    title: 'MOBLAND',
    subtitle: 'Paramount+',
    platform: 'Paramount+',
    releaseDate: 'MARCH 14',
    image: 'https://images.pexels.com/photos/1200450/pexels-photo-1200450.jpeg?auto=compress&cs=tinysrgb&w=400',
    genre: 'Adventure, Action, Sci-Fi',
    rating: 7.2,
    year: 2025,
    duration: '102 min',
    description: 'Two highly-trained operatives are appointed to posts in guard towers on opposite sides of a vast and highly classified gorge, protecting the world from a mysterious evil that lurks within. They work together to keep the secret in the gorge.',
    cast: [
      { name: 'Miles Teller', character: 'Jeff', image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150' },
      { name: 'Anya Taylor-Joy', character: 'Sharon', image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150' },
      { name: 'Sigourney Weaver', character: 'Mary', image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150' },
      { name: 'Tom Hanks', character: 'Sonia', image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150' },
      { name: 'Emma Stone', character: 'Lisa', image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150' }
    ]
  },
  2: {
    id: 2,
    title: 'ADOLESCENCE',
    subtitle: 'NETFLIX',
    platform: 'NETFLIX',
    releaseDate: 'MARCH 13',
    image: 'https://images.pexels.com/photos/3945317/pexels-photo-3945317.jpeg?auto=compress&cs=tinysrgb&w=400',
    genre: 'Drama, Coming-of-age',
    rating: 8.1,
    year: 2025,
    duration: '95 min',
    description: 'A coming-of-age story about a young person navigating the complexities of adolescence, friendship, and self-discovery in a modern world.',
    cast: [
      { name: 'Zendaya', character: 'Maya', image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150' },
      { name: 'Timothée Chalamet', character: 'Alex', image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150' },
      { name: 'Florence Pugh', character: 'Emma', image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150' }
    ]
  },
  3: {
    id: 3,
    title: 'TITANIC',
    subtitle: 'DISNEY+',
    platform: 'DISNEY+',
    releaseDate: 'DECEMBER 19',
    image: 'https://images.pexels.com/photos/3945317/pexels-photo-3945317.jpeg?auto=compress&cs=tinysrgb&w=400',
    genre: 'Romance, Drama, Historical',
    rating: 9.2,
    year: 1997,
    duration: '194 min',
    description: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
    cast: [
      { name: 'Leonardo DiCaprio', character: 'Jack Dawson', image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150' },
      { name: 'Kate Winslet', character: 'Rose DeWitt Bukater', image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150' },
      { name: 'Billy Zane', character: 'Caledon Hockley', image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150' }
    ]
  }
};

const newReleasedData = [
  {
    id: 4,
    title: 'WOLFMAN',
    subtitle: 'PROTECT YOUR OWN',
    platform: 'HBO MAX',
    image: 'https://images.pexels.com/photos/1200450/pexels-photo-1200450.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 5,
    title: 'Severance',
    platform: 'Apple TV+',
    image: 'https://images.pexels.com/photos/3945317/pexels-photo-3945317.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 6,
    title: 'EVERYTHING',
    platform: 'AMAZON',
    image: 'https://images.pexels.com/photos/1200450/pexels-photo-1200450.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

const categoryTabs = ['New', 'Movies', 'TV shows', 'Kids'];

interface WishlistPageProps {
  onToggleBottomNav?: (hide: boolean) => void;
  onVideoPlayerOpen?: (title?: string) => void;
}

export default function WishlistPage({ onToggleBottomNav, onVideoPlayerOpen }: WishlistPageProps) {
  const [activeCategory, setActiveCategory] = useState('New');
  const [showNewReleased, setShowNewReleased] = useState(false);
  const [showRecentlyWatched, setShowRecentlyWatched] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  const handleCardPress = (item: MovieItem) => {
    // Show movie details screen when a card is pressed
    const movieData = movieDetailsData[item.id as keyof typeof movieDetailsData];
    if (movieData) {
      setSelectedMovie(movieData);
      onToggleBottomNav?.(true); // Hide bottom navigation
    }
  };

  const handlePlayMovie = () => {
    // Handle play button press
    console.log('Playing movie:', selectedMovie?.title);
    // You can add video player logic here
  };

  const handleBackFromMovieDetails = () => {
    setSelectedMovie(null);
    onToggleBottomNav?.(false); // Show bottom navigation
  };

  const handleViewAllNewReleased = () => {
    setShowNewReleased(true);
  };

  const handleViewAllRecentlyWatched = () => {
    setShowRecentlyWatched(true);
  };

  // Show Movie Details page when a movie card is clicked
  if (selectedMovie) {
    return (
      <MovieDetailsScreen
        movie={selectedMovie}
        onBack={handleBackFromMovieDetails}
        onPlay={handlePlayMovie}
      />
    );
  }

  // Show New Released page when "View all" is clicked
  if (showNewReleased) {
    return <NewReleasedPage onBack={() => setShowNewReleased(false)} pageType="new-released" />;
  }

  // Show Recently Watched page when "View all" is clicked
  if (showRecentlyWatched) {
    return <NewReleasedPage onBack={() => setShowRecentlyWatched(false)} pageType="recently-watched" />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Watch now</Text>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryWrapper}>
        <View style={styles.categoryContainer}>
          {categoryTabs.map((category) => (
            <TouchableOpacity
              key={category}
              style={styles.categoryTab}
              onPress={() => setActiveCategory(category)}
            >
              {activeCategory === category ? (
                <LinearGradient
                  colors={['#1A1A1A', '#2C2C2C']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.activeCategoryTab}
                >
                  <Text style={styles.activeCategoryText} numberOfLines={1}>
                    {category}
                  </Text>
                </LinearGradient>
              ) : (
                <Text style={styles.categoryText} numberOfLines={1}>
                  {category}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Recently Watched Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently watched</Text>
            <TouchableOpacity onPress={handleViewAllRecentlyWatched}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
            decelerationRate="fast"
            snapToInterval={165} // cardWidth + cardSpacing
            snapToAlignment="start"
          >
            {recentlyWatchedData.map((item) => {
              console.log('Rendering card:', item.title);
              return (
                <MovieCard
                  key={item.id}
                  item={item}
                  onPress={handleCardPress}
                  variant="default"
                />
              );
            })}
          </ScrollView>
        </View>

        {/* New Released Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New released</Text>
            <TouchableOpacity onPress={handleViewAllNewReleased}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
            decelerationRate="fast"
            snapToInterval={165} // cardWidth + cardSpacing
            snapToAlignment="start"
          >
            {newReleasedData.map((item) => (
              <MovieCard
                key={item.id}
                item={item}
                onPress={handleCardPress}
                variant="default"
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 34,
    letterSpacing: 0,
    color: '#ffffff',
  },
  categoryWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    width: 342,
    height: 60,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 10,
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 16,
  },
  categoryTab: {
    width: 61,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    paddingLeft: 8,
    paddingRight: 8,
  },
  activeCategoryTab: {
    width: 61,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#555555',
    paddingLeft: 8,
    paddingRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
    letterSpacing: 0,
    color: '#888888',
    textAlign: 'center',
  },
  activeCategoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
    letterSpacing: 0,
    color: '#ffffff',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  viewAllText: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#888888',
  },
  horizontalScroll: {
    paddingHorizontal: 20,
  },
});
