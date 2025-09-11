import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import MovieInfoPage from './movie-info';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 3; // 3 columns with margins

interface MovieCardProps {
  title: string;
  platform: string;
  imageUrl: string;
  onPress: () => void;
}

function MovieCard({ title, platform, imageUrl, onPress }: MovieCardProps) {
  return (
    <TouchableOpacity style={styles.movieCard} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: imageUrl }} style={styles.movieImage} />
      <View style={styles.movieOverlay}>
        <Text style={styles.movieTitle}>{title}</Text>
        <Text style={styles.moviePlatform}>{platform}</Text>
      </View>
    </TouchableOpacity>
  );
}

interface CategoryChipProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
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
}

export default function MoviesDetailsPage({ onBackPress }: MoviesDetailsPageProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('New');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMovieInfo, setShowMovieInfo] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  const categories = ['New', 'Sci-Fi', 'Comedy', 'Romance', 'Thriller', 'Action', 'Adventure', 'Animation', 'Biography', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Sport', 'War', 'Western'];

  const movies = [
    {
      id: 1,
      title: 'Severance',
      platform: 'Apple TV+',
      imageUrl: 'https://snworksceo.imgix.net/ttd/df199939-19cc-41c1-a949-a86557ec949f.sized-1000x1000.png?w=1000&dpr=2',
      genre: 'Drama, Sci-Fi, Thriller',
      year: '2022',
      duration: '45 min',
      rating: '8.7',
      synopsis: 'Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives. When a mysterious colleague appears outside of work, it begins a journey to discover the truth about their jobs.',
      cast: [
        { name: 'Adam Scott', character: 'Mark Scout', imageUrl: 'https://m.media-amazon.com/images/M/MV5BZGY2ZGFkYjctY2Q4YS00YzVjLWE0YzAtYjQ4YzQ0YzQ0YzQ0XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg' },
        { name: 'Patricia Arquette', character: 'Harmony Cobel', imageUrl: 'https://m.media-amazon.com/images/M/MV5BZGY2ZGFkYjctY2Q4YS00YzVjLWE0YzAtYjQ4YzQ0YzQ0YzQ0XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg' }
      ]
    },
    {
      id: 2,
      title: 'The Last of Us',
      platform: 'HBO Max',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BYWI3ODJlMzktY2U5NC00ZjdlLWE1MGItNWQxZDk3NWNjN2RhXkEyXkFqcGc@._V1_.jpg'
    },
    {
      id: 3,
      title: 'You',
      platform: 'Netflix',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BODA0NDA1MzgtYmIyYS00NmYwLTlhZDYtMjczMTU1M2ZkYzdkXkEyXkFqcGc@._V1_.jpg'
    },
    {
      id: 4,
      title: 'The Handmaid\'s Tale',
      platform: 'Hulu',
      imageUrl: 'https://images.justwatch.com/poster/331049749/s718/season-6.jpg'
    },
    {
      id: 5,
      title: 'Adolescence',
      platform: 'Netflix',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BNGY1YjBiNzMtYWZhNC00OWViLWE0MzItNjc4YzczOGNiM2I0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
    },
    {
      id: 6,
      title: 'The Gorge',
      platform: 'Apple TV+',
      imageUrl: 'https://m.media-amazon.com/images/S/pv-target-images/aab0322a11698c77fe0dc30131b2ffdba59a73d3544a0b25cf5cb7d20e029f84.jpg',
      genre: 'Adventure, Action, Sci-Fi',
      year: '2025',
      duration: '105 min',
      rating: '7.2',
      synopsis: 'Two highly-trained operatives are appointed to posts in guard towers on opposite sides of a vast and highly classified gorge, protecting the world from a mysterious evil that lurks within. They work together to keep the secret in the gorge.',
      cast: [
        { name: 'Miles Teller', character: 'Jeff', imageUrl: 'https://m.media-amazon.com/images/M/MV5BZGY2ZGFkYjctY2Q4YS00YzVjLWE0YzAtYjQ4YzQ0YzQ0YzQ0XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg' },
        { name: 'Anya Taylor-Joy', character: 'Sharon', imageUrl: 'https://m.media-amazon.com/images/M/MV5BZGY2ZGFkYjctY2Q4YS00YzVjLWE0YzAtYjQ4YzQ0YzQ0YzQ0XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg' },
        { name: 'Sigourney Weaver', character: 'Mary', imageUrl: 'https://m.media-amazon.com/images/M/MV5BZGY2ZGFkYjctY2Q4YS00YzVjLWE0YzAtYjQ4YzQ0YzQ0YzQ0XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg' }
      ]
    },
    {
      id: 7,
      title: 'The Signal',
      platform: 'Netflix',
      imageUrl: 'https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p26674282_b_v13_aa.jpg'
    },
    {
      id: 8,
      title: 'Nautilus',
      platform: 'Prime Video',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a6/Nautilus_%282024%29_poster.jpg'
    },
    {
      id: 9,
      title: 'Mobland',
      platform: 'Paramount+',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/d/dc/MobLand.jpg'
    },
    {
      id: 10,
      title: 'Dune: Part Two',
      platform: 'HBO Max',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg'
    },
    {
      id: 11,
      title: 'Oppenheimer',
      platform: 'Peacock',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Oppenheimer_%28film%29.jpg/250px-Oppenheimer_%28film%29.jpg'
    },
    {
      id: 12,
      title: 'Barbie',
      platform: 'HBO Max',
      imageUrl: 'https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p13472534_p_v8_am.jpg'
    },
    {
      id: 13,
      title: 'Spider-Man: Across the Spider-Verse',
      platform: 'Netflix',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Spider-Man-_Across_the_Spider-Verse_poster.jpg/250px-Spider-Man-_Across_the_Spider-Verse_poster.jpg'
    },
    {
      id: 14,
      title: 'Guardians of the Galaxy Vol. 3',
      platform: 'Disney+',
      imageUrl: 'https://resizing.flixster.com/xV7EqckHQwE9I284oqcs3OAwqHc=/fit-in/705x460/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p17845781_v_v13_ar.jpg'
    },
    {
      id: 15,
      title: 'Fast X',
      platform: 'Peacock',
      imageUrl: 'https://image.tmdb.org/t/p/original/pAe4mqaHI7wOS7vz4btYAiX4UVN.jpg'
    }
  ];

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleMoviePress = (movie: any) => {
    console.log('Movie pressed:', movie.title);
    setSelectedMovie(movie);
    setShowMovieInfo(true);
  };

  const handleMovieInfoBackPress = () => {
    setShowMovieInfo(false);
    setSelectedMovie(null);
  };

  if (showMovieInfo && selectedMovie) {
    return <MovieInfoPage onBackPress={handleMovieInfoBackPress} movieData={selectedMovie} />;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#110546', '#0B033A', '#110546', '#000000']}
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
              <Text style={styles.searchIcon}>🔍</Text>
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
              {categories.map((category) => (
                <CategoryChip
                  key={category}
                  title={category}
                  isActive={selectedCategory === category}
                  onPress={() => setSelectedCategory(category)}
                />
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Scrollable Movies Grid */}
        <ScrollView 
          style={styles.scrollableContent} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
        >
          <View style={styles.moviesGrid}>
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                title={movie.title}
                platform={movie.platform}
                imageUrl={movie.imageUrl}
                onPress={() => handleMoviePress(movie)}
              />
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
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
    marginTop: 200, // Increased height to account for all sticky elements
  },
  scrollContentContainer: {
    paddingBottom: 120, // Extra padding for bottom navigation
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 12,
  },
  activeChip: {
    backgroundColor: '#A259FF',
  },
  chipText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  activeChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  moviesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingTop: 30,
  },
  movieCard: {
    width: cardWidth,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  movieImage: {
    width: '100%',
    height: cardWidth * 1.5, // 3:2 aspect ratio
    backgroundColor: '#2a2a2a',
  },
  movieOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
  },
  movieTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  moviePlatform: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
