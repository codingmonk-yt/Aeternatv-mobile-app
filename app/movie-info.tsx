import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface MovieInfoPageProps {
  onBackPress?: () => void;
  movieData?: {
    id: number;
    title: string;
    platform: string;
    imageUrl: string;
    genre?: string;
    year?: string;
    duration?: string;
    rating?: string;
    synopsis?: string;
    cast?: Array<{
      name: string;
      character: string;
      imageUrl: string;
    }>;
  };
}

export default function MovieInfoPage({ onBackPress, movieData }: MovieInfoPageProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);

  // Default movie data if none provided
  const movie = movieData || {
    id: 1,
    title: 'The Gorge',
    platform: 'Apple TV+',
    imageUrl: 'https://m.media-amazon.com/images/S/pv-target-images/aab0322a11698c77fe0dc30131b2ffdba59a73d3544a0b25cf5cb7d20e029f84.jpg',
    genre: 'Adventure, Action, Sci-Fi',
    year: '2025',
    duration: '105 min',
    rating: '7.2',
    synopsis: 'Two highly-trained operatives are appointed to posts in guard towers on opposite sides of a vast and highly classified gorge, protecting the world from a mysterious evil that lurks within. They work together to keep the secret in the gorge.',
    cast: [
      {
        name: 'Miles Teller',
        character: 'Jeff',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BMTQ5MDU5MTktMDZkMy00NDU1LWIxM2UtODg5OGFiNmRhNDBjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
      },
      {
        name: 'Anya Taylor-Joy',
        character: 'Sharon',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BZGY2ZGFkYjctY2Q4YS00YzVjLWE0YzAtYjQ4YzQ0YzQ0YzQ0XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg'
      },
      {
        name: 'Sigourney Weaver',
        character: 'Mary',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BZGY2ZGFkYjctY2Q4YS00YzVjLWE0YzAtYjQ4YzQ0YzQ0YzQ0XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg'
      },
      {
        name: 'Sonia',
        character: 'Sonia',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BZGY2ZGFkYjctY2Q4YS00YzVjLWE0YzAtYjQ4YzQ0YzQ0YzQ0XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg'
      }
    ]
  };

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handlePlayPress = () => {
    console.log('Play button pressed for:', movie.title);
    // TODO: Navigate to video player
  };

  const handleSharePress = async () => {
    try {
      const result = await Share.share({
        message: `Check out "${movie.title}" on ${movie.platform}! ${movie.synopsis?.substring(0, 100)}...`,
        title: movie.title,
      });
      
      if (result.action === Share.sharedAction) {
        console.log('Content shared successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share content');
      console.error('Share error:', error);
    }
  };

  const handleBookmarkPress = () => {
    console.log('Bookmark button pressed');
    // TODO: Implement bookmark functionality
  };

  const truncatedSynopsis = movie.synopsis && movie.synopsis.length > 150 
    ? movie.synopsis.substring(0, 150) + '...'
    : movie.synopsis;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Movie Poster Banner - Full Screen from Top */}
        <View style={[styles.posterContainer, { paddingTop: insets.top }]}>
          {/* Image with Gradient Overlay */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: movie.imageUrl }} style={styles.posterImage} />
            <LinearGradient
              colors={['rgb(0, 0, 0)', 'rgba(0, 0, 0, 0.65)', 'rgba(0, 0, 0, 0.3)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 0.4 }}
              style={styles.gradientOverlay}
            />
          </View>

          {/* Header with back button and action buttons - Positioned above banner */}
          <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>
            
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleSharePress}>
                <Text style={styles.actionIcon}>↗</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleBookmarkPress}>
                <Text style={styles.actionIcon}>♡</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Platform Logo */}
          <View style={styles.platformLogo}>
            <Text style={styles.platformText}>{movie.platform}</Text>
          </View>

          {/* Play Button */}
          <TouchableOpacity style={styles.playButton} onPress={handlePlayPress}>
            <LinearGradient
              colors={['#A259FF', '#562199']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.playButtonGradient}
            >
              <Text style={styles.playIcon}>▶</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Movie Title Overlay */}
          <View style={styles.titleOverlay}>
            <Text style={styles.movieTitle}>{movie.title}</Text>
            <Text style={styles.movieTagline}>THE WORLD'S MOST DANGEROUS SECRET LIES BETWEEN THEM</Text>
            <Text style={styles.castNames}>
              {movie.cast?.slice(0, 3).map(actor => actor.name).join(', ')}
            </Text>
            <Text style={styles.originalFilm}>AN APPLE ORIGINAL FILM BY SKYDANCE</Text>
          </View>
        </View>

        {/* Movie Details */}
        <View style={styles.movieDetails}>
          <Text style={styles.movieTitleText}>{movie.title}</Text>
          <Text style={styles.genreText}>{movie.genre}</Text>

          {/* Info Boxes */}
          <View style={styles.infoBoxes}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>IMDB</Text>
              <Text style={styles.infoValue}>⭐ {movie.rating}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Year</Text>
              <Text style={styles.infoValue}>{movie.year}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Time</Text>
              <Text style={styles.infoValue}>{movie.duration}</Text>
            </View>
          </View>

          {/* Synopsis */}
          <View style={styles.synopsisContainer}>
            <Text style={styles.synopsisText}>
              {showFullSynopsis ? movie.synopsis : truncatedSynopsis}
            </Text>
            {movie.synopsis && movie.synopsis.length > 150 && (
              <TouchableOpacity onPress={() => setShowFullSynopsis(!showFullSynopsis)}>
                <Text style={styles.readMoreText}>
                  {showFullSynopsis ? 'Read less' : 'Read more'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Top Cast */}
          <View style={styles.castContainer}>
            <Text style={styles.castTitle}>Top cast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.castScrollView}>
              {movie.cast?.map((actor, index) => (
                <View key={index} style={styles.castMember}>
                  <Image source={{ uri: actor.imageUrl }} style={styles.castImage} />
                  <Text style={styles.castName}>{actor.name}</Text>
                  <Text style={styles.castCharacter}>{actor.character}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
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
  posterContainer: {
    height: height * 0.6,
    width: '100%',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  posterImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    objectFit: "contain",
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#000000',
  },
  platformLogo: {
    position: 'absolute',
    top: 100,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    zIndex: 5,
  },
  platformText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    width: 60,
    height: 60,
    borderRadius: 30,
    zIndex: 5,
  },
  playButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#A259FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  playIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    marginLeft: 2,
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    zIndex: 5,
  },
  movieTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  movieTagline: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  castNames: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '600',
  },
  originalFilm: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  movieDetails: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    backgroundColor: '#000000',
    paddingTop: 20,
  },
  movieTitleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  genreText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 20,
  },
  infoBoxes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  synopsisContainer: {
    marginBottom: 32,
  },
  synopsisText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
    marginBottom: 8,
  },
  readMoreText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textDecorationLine: 'underline',
  },
  castContainer: {
    marginBottom: 20,
  },
  castTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  castScrollView: {
    flexDirection: 'row',
  },
  castMember: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  castImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2a2a2a',
    marginBottom: 8,
  },
  castName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 2,
  },
  castCharacter: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});
