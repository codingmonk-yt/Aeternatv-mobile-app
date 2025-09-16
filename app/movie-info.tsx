import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, PlayIcon, Share2Icon } from "lucide-react-native";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ErrorMessage } from "../src/components/common/ErrorMessage";
import { useMovieDetails } from "../src/hooks/useMovieDetails";
import { useOrientationLock } from "../src/hooks/useOrientationLock";
import { useGetStreamUrlQuery } from "../src/store/api/apiSlice";
import { getResponsiveIconSize, getResponsivePadding, getResponsiveSpacing, responsiveStyles } from "../src/utils/responsive";
import VideoPlayerPage from "./video-player";

const { width, height } = Dimensions.get("window");

interface MovieInfoPageProps {
  onBackPress?: () => void;
  movieId?: string;
  onVideoPlayerOpen?: (title?: string, videoUrl?: string) => void;
}

export default function MovieInfoPage({
  onBackPress,
  movieId: propMovieId,
  onVideoPlayerOpen,
}: MovieInfoPageProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  
  // Lock orientation to portrait
  useOrientationLock();
  
  // Get movieId from props or URL params
  const movieId = propMovieId || (params.movieId ? String(params.movieId) : null);
  
  // Fetch movie details using the hook
  const { movieDetails, similarMovies, isLoading, error, refetch } = useMovieDetails(movieId || '');
  
  // Stream URL API call - only trigger when we have provider and stream_id
  const { 
    data: streamData, 
    isLoading: isStreamLoading, 
    error: streamError,
    refetch: refetchStream 
  } = useGetStreamUrlQuery(
    { 
      providerId: movieDetails?.provider || '', 
      streamId: movieDetails?.stream_id?.toString() || '' 
    },
    { 
      skip: !movieDetails?.provider || !movieDetails?.stream_id || !showVideoPlayer 
    }
  );

  // Handle stream URL response
  React.useEffect(() => {
    if (streamData?.success && streamData.data?.streamUrl) {
      setStreamUrl(streamData.data.streamUrl);
    }
  }, [streamData]);

  // Handle video player opening when stream URL is ready
  React.useEffect(() => {
    if (showVideoPlayer && streamUrl && onVideoPlayerOpen && movieDetails) {
      onVideoPlayerOpen(movieDetails.title, streamUrl);
    }
  }, [showVideoPlayer, streamUrl, onVideoPlayerOpen, movieDetails]);

  // Debug logging to identify the issue
  console.log('=== Movie Info Debug ===');
  console.log('movieId:', movieId);
  console.log('isLoading:', isLoading);
  console.log('error:', error);
  console.log('movieDetails:', movieDetails);
  console.log('similarMovies:', similarMovies);
  console.log('streamData:', streamData);
  console.log('streamUrl:', streamUrl);
  console.log('isStreamLoading:', isStreamLoading);
  console.log('streamError:', streamError);
  console.log('========================');

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  // Show loading spinner if no movieId or still loading
  if (!movieId || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading movie info...</Text>
      </View>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <View style={styles.container}>
        <View style={[styles.header]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <ErrorMessage error={error} onRetry={refetch} />
        </View>
      </View>
    );
  }

  // Show error if no movie details found
  if (!movieDetails) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + getResponsiveSpacing(10) }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.noDataText}>Movie not found</Text>
        </View>
      </View>
    );
  }

  // Use API data
  const movie = {
    id: movieDetails.stream_id,
    title: movieDetails.title,
    platform: "Streaming Platform", // You can map this from provider if needed
    imageUrl: movieDetails.cover_big || movieDetails.movie_image || movieDetails.stream_icon,
    genre: movieDetails.genre || "Unknown",
    year: movieDetails.year || "Unknown",
    duration: movieDetails.duration || "Unknown",
    rating: movieDetails.rating?.toString() || "0",
    synopsis: movieDetails.description || movieDetails.plot || "No description available",
    cast: movieDetails.actors ? movieDetails.actors.split(', ').map((actor: string, index: number) => ({
      name: actor.trim(),
      character: `Character ${index + 1}`,
      imageUrl: "https://via.placeholder.com/60x60/2a2a2a/ffffff?text=?", // Placeholder for cast images
    })) : [],
  };

  const handlePlayPress = () => {
    console.log("Play button pressed for:", movie.title);
    console.log("Provider:", movieDetails?.provider);
    console.log("Stream ID:", movieDetails?.stream_id);
    
    // Trigger stream URL API call
    setShowVideoPlayer(true);
  };

  const handleCloseVideoPlayer = () => {
    setShowVideoPlayer(false);
    setStreamUrl(null);
  };

  const handleSharePress = async () => {
    try {
      const result = await Share.share({
        message: `Check out "${movie.title}" on ${
          movie.platform
        }! ${movie.synopsis?.substring(0, 100)}...`,
        title: movie.title,
      });

      if (result.action === Share.sharedAction) {
        console.log("Content shared successfully");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to share content");
      console.error("Share error:", error);
    }
  };


  const truncatedSynopsis =
    movie.synopsis && movie.synopsis.length > 150
      ? movie.synopsis.substring(0, 150) + "..."
      : movie.synopsis;

  // Show video player when stream URL is ready
  if (showVideoPlayer && streamUrl) {
    // If we have onVideoPlayerOpen prop, let the layout handle the video player
    if (onVideoPlayerOpen) {
      return null; // Let the layout handle the video player
    }
    
    // Fallback to local video player if no onVideoPlayerOpen prop
    return (
      <VideoPlayerPage
        videoUrl={streamUrl}
        title={movie.title}
        onBackPress={handleCloseVideoPlayer}
      />
    );
  }

  // Show loading state when fetching stream URL
  if (showVideoPlayer && isStreamLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading video...</Text>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={handleCloseVideoPlayer}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show error state if stream URL fetch failed
  if (showVideoPlayer && streamError) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + getResponsiveSpacing(10) }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleCloseVideoPlayer}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Failed to load video</Text>
          <Text style={styles.errorMessage}>
            Unable to get video stream. Please try again.
          </Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => refetchStream()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Movie Poster Banner - Full Screen from Top */}
        <View style={[styles.posterContainer, { paddingTop: insets.top }]}>
          {/* Image with Gradient Overlay */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: movie.imageUrl }}
              style={styles.posterImage}
            />
            <LinearGradient
              colors={[
                "rgba(0, 0, 0, 0.8)",
                "rgba(0, 0, 0, 0.4)",
                "transparent",
                "transparent",
                "rgba(0, 0, 0, 0.4)",
                "rgba(0, 0, 0, 0.8)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.gradientOverlay}
            />
          </View>

          {/* Header with back button and action buttons - Positioned above banner */}
          <View style={[styles.header, { paddingTop: insets.top + getResponsiveSpacing(10) }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Text style={styles.backIcon}>
                <ChevronLeft color="#FFFFFF" />
              </Text>
            </TouchableOpacity>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleSharePress}
              >
                <Text style={styles.actionIcon}>
                  <Share2Icon color="#FFFFFF" />
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Platform Logo */}
          {/* <View style={styles.platformLogo}>
            <Text style={styles.platformText}>{movie.platform}</Text>
          </View> */}


          {/* Movie Title Overlay */}
          {/* <View style={styles.titleOverlay}>
            <Text style={styles.movieTitle}>{movie.title}</Text>
            <Text style={styles.movieTagline}>THE WORLD'S MOST DANGEROUS SECRET LIES BETWEEN THEM</Text>
            <Text style={styles.castNames}>
              {movie.cast?.slice(0, 3).map(actor => actor.name).join(', ')}
            </Text>
            <Text style={styles.originalFilm}>AN APPLE ORIGINAL FILM BY SKYDANCE</Text>
          </View> */}
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
              <TouchableOpacity
                onPress={() => setShowFullSynopsis(!showFullSynopsis)}
              >
                <Text style={styles.readMoreText}>
                  {showFullSynopsis ? "Read less" : "Read more"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Top Cast */}
          <View style={styles.castContainer}>
            <Text style={styles.castTitle}>Top cast</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.castScrollView}
            >
              {movie.cast?.map((actor: any, index: number) => (
                <View key={index} style={styles.castMember}>
                  <LinearGradient
                    colors={['#420000', '#2D0000', '#1A0000']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.castAvatar}
                  >
                    <Text style={styles.castAvatarText}>
                      {actor.name?.charAt(0)?.toUpperCase() || '?'}
                    </Text>
                  </LinearGradient>
                  <Text style={styles.castName}>{actor.name}</Text>
                  {/* <Text style={styles.castCharacter}>{actor.character}</Text> */}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Play Button - Floating at bottom of banner */}
        <View style={styles.playButtonContainer}>
          <TouchableOpacity style={styles.playButton} onPress={handlePlayPress}>
            <LinearGradient
              colors={["#420000", "#2D0000", "#1A0000"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.playButtonGradient}
            >
              <Text style={styles.playIcon}>
                <PlayIcon fill="#FFFFFF" color="#FFFFFF" />
              </Text>
              <Text style={styles.playText}>Play</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  posterContainer: {
    height: height * 0.6,
    width: "100%",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  posterImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    objectFit: "contain",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsivePadding(20),
    zIndex: 10,
  },
  backButton: {
    width: getResponsiveIconSize(40),
    height: getResponsiveIconSize(40),
    borderRadius: getResponsiveIconSize(20),
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: getResponsiveIconSize(24),
    color: "#FFFFFF",
    fontWeight: "300",
  },
  headerActions: {
    flexDirection: "row",
    gap: getResponsiveSpacing(12),
  },
  actionButton: {
    width: getResponsiveIconSize(40),
    height: getResponsiveIconSize(40),
    borderRadius: getResponsiveIconSize(20),
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionIcon: {
    fontSize: getResponsiveIconSize(18),
    color: "#FFFFFF",
    width: getResponsiveIconSize(20),
    height: getResponsiveIconSize(20),
    tintColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#000000",
  },
  platformLogo: {
    position: "absolute",
    top: 100,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    zIndex: 5,
  },
  platformText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  playButtonContainer: {
    position: "absolute",
    top: height * 0.6 - getResponsiveSpacing(40), // Position at bottom of banner area
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  playButton: {
    width: getResponsiveSpacing(200),
    height: getResponsiveSpacing(60),
    borderRadius: getResponsiveSpacing(30),
    shadowColor: "#420000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  playButtonGradient: {
    width: getResponsiveSpacing(200),
    height: getResponsiveSpacing(60),
    borderRadius: getResponsiveSpacing(30),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: getResponsivePadding(24),
  },
  playIcon: {
    fontSize: getResponsiveIconSize(20),
    color: "#FFFFFF",
    marginRight: getResponsiveSpacing(8),
  },
  playText: {
    fontSize: responsiveStyles.subtitle.fontSize,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  titleOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 20,
    zIndex: 5,
  },
  movieTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  movieTagline: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "500",
  },
  castNames: {
    fontSize: 12,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 4,
    fontWeight: "600",
  },
  originalFilm: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  movieDetails: {
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsiveSpacing(80), // Reduced from 100 to 80
    backgroundColor: "#000000",
    paddingTop: getResponsiveSpacing(30), // Reduced from 50 to 30
  },
  movieTitleText: {
    fontSize: responsiveStyles.title.fontSize * 1.2,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: getResponsiveSpacing(8),
  },
  genreText: {
    fontSize: responsiveStyles.body.fontSize,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: getResponsiveSpacing(20),
  },
  infoBoxes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: getResponsiveSpacing(24),
  },
  infoBox: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(12),
    borderRadius: getResponsiveSpacing(8),
    flex: 1,
    marginHorizontal: getResponsiveSpacing(4),
    alignItems: "center",
  },
  infoLabel: {
    fontSize: responsiveStyles.caption.fontSize,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: getResponsiveSpacing(4),
  },
  infoValue: {
    fontSize: responsiveStyles.body.fontSize,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  synopsisContainer: {
    marginBottom: getResponsiveSpacing(32),
  },
  synopsisText: {
    fontSize: responsiveStyles.body.fontSize,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 24,
    marginBottom: getResponsiveSpacing(8),
  },
  readMoreText: {
    fontSize: responsiveStyles.caption.fontSize,
    color: "rgba(255, 255, 255, 0.7)",
    textDecorationLine: "underline",
  },
  castContainer: {
    marginBottom: getResponsiveSpacing(20),
  },
  castTitle: {
    fontSize: responsiveStyles.subtitle.fontSize,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: getResponsiveSpacing(16),
  },
  castScrollView: {
    flexDirection: "row",
  },
  castMember: {
    alignItems: "center",
    marginRight: getResponsiveSpacing(20),
    width: getResponsiveIconSize(80),
  },
  castAvatar: {
    width: getResponsiveIconSize(60),
    height: getResponsiveIconSize(60),
    borderRadius: getResponsiveIconSize(30),
    marginBottom: getResponsiveSpacing(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  castAvatarText: {
    fontSize: responsiveStyles.subtitle.fontSize,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  castName: {
    fontSize: responsiveStyles.caption.fontSize,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: getResponsiveSpacing(2),
  },
  castCharacter: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  noDataText: {
    fontSize: 18,
    color: "#CCCCCC",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: responsiveStyles.body.fontSize,
    marginTop: getResponsiveSpacing(16),
  },
  cancelButton: {
    marginTop: getResponsiveSpacing(20),
    paddingHorizontal: getResponsivePadding(24),
    paddingVertical: getResponsivePadding(12),
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: getResponsiveSpacing(8),
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: responsiveStyles.body.fontSize,
    fontWeight: "600",
  },
  errorTitle: {
    fontSize: responsiveStyles.title.fontSize,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: getResponsiveSpacing(8),
    textAlign: "center",
  },
  errorMessage: {
    fontSize: responsiveStyles.body.fontSize,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: getResponsiveSpacing(24),
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: "#420000",
    paddingHorizontal: getResponsivePadding(24),
    paddingVertical: getResponsivePadding(12),
    borderRadius: getResponsiveSpacing(8),
    alignSelf: "center",
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: responsiveStyles.body.fontSize,
    fontWeight: "600",
  },
});
