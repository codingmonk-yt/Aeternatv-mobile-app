import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ErrorScreenWrapper } from "../src/components/common/ErrorScreens";
import { useOrientationLock } from "../src/hooks/useOrientationLock";
import { useSeriesInfo } from "../src/hooks/useSeriesInfo";
import { useGetSeriesEpisodeStreamUrlQuery } from "../src/store/api/apiSlice";

const { width, height } = Dimensions.get("window");

interface SeriesInfoPageProps {
  onBackPress?: () => void;
  seriesId?: string;
  onVideoPlayerOpen?: (title?: string, videoUrl?: string) => void;
}

export default function SeriesInfoPage({
  onBackPress,
  seriesId,
  onVideoPlayerOpen,
}: SeriesInfoPageProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedSeason, setSelectedSeason] = useState("1");
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<any>(null);
  
  // Lock orientation to portrait
  useOrientationLock();

  // Fetch series info using the API (only once when component mounts)
  const { seriesInfo, isLoading, error } = useSeriesInfo(seriesId || null);
  
  // Episode Stream URL API call - only trigger when we have provider and episode_id
  const { 
    data: episodeStreamData, 
    isLoading: isEpisodeStreamLoading, 
    error: episodeStreamError,
    refetch: refetchEpisodeStream 
  } = useGetSeriesEpisodeStreamUrlQuery(
    { 
      providerId: seriesInfo?.data?.provider || '', 
      episodeId: selectedEpisode?.id || '' 
    },
    { 
      skip: !seriesInfo?.data?.provider || !selectedEpisode?.id || !showVideoPlayer 
    }
  );


  // Memoize series data to prevent unnecessary re-renders
  const series = useMemo(() => {
    // Extract series data from API response
    // API response structure: { success: true, data: { ... } }
    const apiSeries = seriesInfo?.data || seriesInfo;
    
    // Only return fallback data if we have an error and no actual data
    if (apiSeries) {
      return apiSeries;
    }
    
    // Return fallback data only when there's an error (not during loading)
    if (error && !isLoading) {
      return {
        _id: "fallback-series",
        name: "Breaking Bad: A Química do Mal [L] (2008)",
        title: "Breaking Bad: A Química do Mal [L]",
        year: "2008",
        cover: "https://image.tmdb.org/t/p/w780/30erzlzIOtOK3k3T3BAl1GiVMP1.jpg",
        plot: "Ao saber que tem câncer, um professor passa a fabricar metanfetamina pelo futuro da família, mudando o destino de todos.",
        cast: "Bryan Cranston, Aaron Paul, Anna Gunn, RJ Mitte, Dean Norris",
        director: "Michelle MacLaren",
        genre: "Drama, Crime",
        release_date: "2008-01-20",
        releaseDate: "2008-01-20",
        last_modified: "1736505758",
        rating: "9",
        rating_5based: 4.5,
        backdrop_path: [
          "https://image.tmdb.org/t/p/w1280/9faGSFi5jam6pDWGNd0p8JcJgXQ.jpg"
        ],
        youtube_trailer: "XrVlzrRECY4",
        episode_run_time: "45",
        category_id: "169",
        category_ids: [169],
        seasons: [
          {
            air_date: "2025-08-14",
            episode_count: "7",
            name: "Temporada 1",
            overview: "",
            season_number: "1",
            cover: "",
            cover_big: "",
            vote_average: 0
          }
        ],
        episodes: {
          "1": []
        }
      };
    }
    
    // Return empty object during loading to prevent fallback data from showing
    return {
      _id: "",
      name: "",
      title: "",
      year: "",
      cover: "",
      plot: "",
      cast: "",
      director: "",
      genre: "",
      release_date: "",
      releaseDate: "",
      last_modified: "",
      rating: "",
      rating_5based: 0,
      backdrop_path: [],
      youtube_trailer: "",
      episode_run_time: "",
      category_id: "",
      category_ids: [],
      seasons: [],
      episodes: {}
    };
  }, [seriesInfo, error, isLoading]);

  // Memoize current season data to prevent re-calculation on every render
  const currentSeason = useMemo(() => {
    return series.seasons?.find((s: any) => s.season_number === selectedSeason) || series.seasons?.[0];
  }, [series.seasons, selectedSeason]);

  // Memoize current episodes to prevent re-calculation on every render
  const currentEpisodes = useMemo(() => {
    // Ensure episodes exists and is an object, then get the selected season
    if (series.episodes && typeof series.episodes === 'object') {
      return series.episodes[selectedSeason] || [];
    }
    return [];
  }, [series.episodes, selectedSeason]);

  // Handle episode stream URL response
  React.useEffect(() => {
    if (episodeStreamData?.success && episodeStreamData.data?.streamUrl) {
      setStreamUrl(episodeStreamData.data.streamUrl);
    }
  }, [episodeStreamData]);

  // Handle video player opening when stream URL is ready
  React.useEffect(() => {
    if (showVideoPlayer && streamUrl && onVideoPlayerOpen && selectedEpisode) {
      onVideoPlayerOpen(selectedEpisode.title, streamUrl);
    }
  }, [showVideoPlayer, streamUrl, onVideoPlayerOpen, selectedEpisode]);


  // Memoize event handlers to prevent unnecessary re-renders
  const handleBackPress = useCallback(() => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  }, [onBackPress, router]);

  const handleEpisodePress = useCallback((episode: any) => {
    // Set selected episode and trigger stream URL API call
    setSelectedEpisode(episode);
    setShowVideoPlayer(true);
  }, []);

  const handleCloseVideoPlayer = useCallback(() => {
    setShowVideoPlayer(false);
    setStreamUrl(null);
    setSelectedEpisode(null);
  }, []);

  const handleSeasonSelect = useCallback((seasonNumber: string) => {
    setSelectedSeason(seasonNumber);
    setShowSeasonDropdown(false);
  }, []);

  const handleSeasonDropdownToggle = useCallback(() => {
    setShowSeasonDropdown(prev => !prev);
  }, []);

  // Show video player when stream URL is ready
  if (showVideoPlayer && streamUrl) {
    // If we have onVideoPlayerOpen prop, let the layout handle the video player
    if (onVideoPlayerOpen) {
      return null; // Let the layout handle the video player
    }
    
    // Fallback to local video player if no onVideoPlayerOpen prop
    return (
      <View style={styles.container}>
        <Text>Video Player would open here with: {streamUrl}</Text>
        <TouchableOpacity onPress={handleCloseVideoPlayer}>
          <Text style={{ color: 'white' }}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show loading state when fetching episode stream URL
  if (showVideoPlayer && isEpisodeStreamLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading episode...</Text>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={handleCloseVideoPlayer}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show error state if episode stream URL fetch failed
  if (showVideoPlayer && episodeStreamError) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleCloseVideoPlayer}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Failed to load episode</Text>
          <Text style={styles.errorMessage}>
            Unable to get episode stream. Please try again.
          </Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => refetchEpisodeStream()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Show loading state when fetching series info
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading series information...</Text>
      </View>
    );
  }

  return (
    <ErrorScreenWrapper
      isLoading={false}
      error={error}
      onRetry={() => {
        // The hook will automatically retry when seriesId changes
        console.log('Retrying...');
      }}
      serverErrorMessage="Failed to load series information. Please try again."
      offlineMessage="You're offline. Please check your internet connection to view series details."
    >
      <TouchableWithoutFeedback onPress={() => setShowSeasonDropdown(false)}>
        <View style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
        {/* Hero Section with Background Image */}
        <View style={[styles.heroContainer, { paddingTop: insets.top }]}>
          {/* Background Image with Blur Effect */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: series.cover || series.backdrop_path?.[0] }}
              style={styles.heroImage}
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

          {/* Header with back button and season selector */}
          <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.seasonSelector}
              onPress={handleSeasonDropdownToggle}
            >
              <Text style={styles.seasonText}>{currentSeason?.name || `Season ${selectedSeason}`}</Text>
              <Text style={styles.chevronIcon}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Series Title and Rating */}
          <View style={styles.titleSection}>
            <Text style={styles.seriesTitle}>{series.title || series.name}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={styles.ratingText}>{series.rating}</Text>
              <Text style={styles.yearText}>{series.year}</Text>
            </View>
          </View>
        </View>

        {/* Season Dropdown */}
        {showSeasonDropdown && (
          <View style={styles.seasonDropdown}>
            {series.seasons?.map((season: any) => (
              <TouchableOpacity
                key={season.season_number}
                style={styles.seasonOption}
                onPress={() => handleSeasonSelect(season.season_number)}
              >
                <Text style={styles.seasonOptionText}>{season.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Episodes List Section */}
        <View style={styles.episodesContainer}>
          {isLoading ? (
            <View style={styles.loadingEpisodesContainer}>
              <Text style={styles.loadingEpisodesText}>Loading episodes...</Text>
            </View>
          ) : Array.isArray(currentEpisodes) && currentEpisodes.length > 0 ? (
            currentEpisodes.map((episode: any, index: number) => {
              // Always use series backdrop for episode thumbnails
              const episodeImage = series.backdrop_path?.[0] || series.cover;
              
              return (
                <TouchableOpacity
                  key={`${episode.id}-${selectedSeason}`} // Include season in key to force re-render when season changes
                  style={styles.episodeCard}
                  onPress={() => handleEpisodePress(episode)}
                  activeOpacity={0.8}
                >
                  {episodeImage ? (
                    <Image
                      source={{ uri: episodeImage }}
                      style={styles.episodeThumbnail}
                    />
                  ) : (
                    <View style={[styles.episodeThumbnail, styles.placeholderContainer]}>
                      <Text style={styles.placeholderIcon}>🎬</Text>
                      <Text style={styles.placeholderText}>No Image</Text>
                    </View>
                  )}
                  <View style={styles.episodeInfo}>
                    <Text style={styles.episodeTitle}>{episode.title}</Text>
                    <Text style={styles.episodeDetails}>
                      E{episode.episode_num} · {episode.info?.duration}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.noEpisodesContainer}>
              <Text style={styles.noEpisodesText}>No episodes available for this season</Text>
            </View>
          )}
        </View>
      </ScrollView>
      </View>
    </TouchableWithoutFeedback>
    </ErrorScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#000000",
  },
  heroContainer: {
    height: height * 0.5,
    width: "100%",
    position: "relative",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
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
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "300",
  },
  seasonSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  seasonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
    marginRight: 8,
  },
  chevronIcon: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  seasonDropdown: {
    position: "absolute",
    top: 100,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    borderRadius: 8,
    paddingVertical: 8,
    minWidth: 120,
    zIndex: 20,
  },
  seasonOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  seasonOptionText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  titleSection: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 5,
  },
  seriesTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
    marginRight: 12,
  },
  yearText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  episodesContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
    backgroundColor: "#000000",
  },
  episodeCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    alignItems: "center",
  },
  episodeThumbnail: {
    width: 80,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#2a2a2a",
    marginRight: 12,
  },
  episodeInfo: {
    flex: 1,
  },
  episodeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  episodeDetails: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  placeholderContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
  },
  placeholderIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  placeholderText: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
  },
  noEpisodesContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  noEpisodesText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
  },
  loadingEpisodesContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  loadingEpisodesText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    fontStyle: "italic",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 16,
  },
  cancelButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: "#420000",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: "center",
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
