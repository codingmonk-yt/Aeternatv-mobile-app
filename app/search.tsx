import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Search } from "lucide-react-native";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ErrorScreenWrapper } from "../src/components/common/ErrorScreens";
import KeyboardDismissWrapper from "../src/components/common/KeyboardDismissWrapper";
import { useDebounce } from "../src/hooks/useDebounce";
import { useLiveTv } from "../src/hooks/useLiveTv";
import { useMovies } from "../src/hooks/useMovies";
import { useSeries } from "../src/hooks/useSeries";
import { getResponsiveIconSize, getResponsivePadding, getResponsiveSpacing, responsiveStyles } from "../src/utils/responsive";
import LiveTvInfoPage from "./live-tv-info";
import MovieInfoPage from "./movie-info";
import SeriesInfoPage from "./series-info";

const { width } = Dimensions.get("window");

// Import not-found illustration
const notFoundImage = require('../assets/illustrations/not-found.png');

// Using the actual API data types from the hooks
type ContentType = "Movies" | "Series" | "Live TV";

interface TabButtonProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
}

function TabButton({ title, isActive, onPress }: TabButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTab]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

interface SearchResultItemProps {
  item: any;
  contentType: ContentType;
  onPress: () => void;
  isSelected?: boolean;
}

interface EmptySearchResultsProps {
  searchQuery: string;
  contentType: ContentType;
}

function EmptySearchResults({ searchQuery, contentType }: EmptySearchResultsProps) {
  return (
    <View style={styles.emptyStateContainer}>
      <Image 
        source={notFoundImage} 
        style={styles.emptyStateImage}
        resizeMode="contain"
      />
      <Text style={styles.emptyStateTitle}>
        No {contentType.toLowerCase()} found
      </Text>
      <Text style={styles.emptyStateMessage}>
        {searchQuery 
          ? `No results for "${searchQuery}"` 
          : `No ${contentType.toLowerCase()} available`
        }
      </Text>
    </View>
  );
}

function SearchResultItem({ item, contentType, onPress, isSelected }: SearchResultItemProps) {
  const [imageError, setImageError] = useState(false);
  
  // Get image URL based on content type
  const getImageUrl = () => {
    switch (contentType) {
      case "Movies":
        return item.cover_big || item.movie_image || item.stream_icon;
      case "Series":
        return item.cover || item.backdrop_path?.[0];
      case "Live TV":
        return item.stream_icon;
      default:
        return "";
    }
  };

  // Get title based on content type
  const getTitle = () => {
    switch (contentType) {
      case "Movies":
        return item.title || item.name;
      case "Series":
        return item.title || item.name;
      case "Live TV":
        return item.name;
      default:
        return "";
    }
  };

  // Get year/rating info based on content type
  const getMetadata = () => {
    switch (contentType) {
      case "Movies":
        return `${contentType} · ${item.year || 'N/A'} · ${item.rating || 'N/A'}`;
      case "Series":
        return `${contentType} · ${item.year || 'N/A'} · ${item.rating || 'N/A'}`;
      case "Live TV":
        return `${contentType} · Live`;
      default:
        return contentType;
    }
  };

  const imageUrl = getImageUrl();
  const hasValidImage = imageUrl && imageUrl.trim() !== '';

  return (
    <TouchableOpacity
      style={[styles.resultItem, isSelected && styles.selectedResultItem]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {hasValidImage && !imageError ? (
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.resultThumbnail}
          onError={() => setImageError(true)}
        />
      ) : (
        <View style={styles.placeholderThumbnail}>
          <Text style={styles.placeholderIcon}>
            {contentType === "Movies" ? "🎬" : contentType === "Series" ? "📺" : "📡"}
          </Text>
        </View>
      )}
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle} numberOfLines={1}>{getTitle()}</Text>
        <Text style={styles.resultMetadata}>{getMetadata()}</Text>
      </View>
    </TouchableOpacity>
  );
}

interface SearchPageProps {
  onVideoPlayerOpen?: (title?: string) => void;
}

export default function SearchPage({ onVideoPlayerOpen }: SearchPageProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ContentType>("Movies");
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [showMovieInfo, setShowMovieInfo] = useState(false);
  const [showSeriesInfo, setShowSeriesInfo] = useState(false);
  const [showLiveTvInfo, setShowLiveTvInfo] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [selectedSeries, setSelectedSeries] = useState<any>(null);
  const [selectedLiveTv, setSelectedLiveTv] = useState<any>(null);

  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 500);

  // API hooks for each content type
  const {
    movies,
    isLoading: moviesLoading,
    isFetching: moviesFetching,
    error: moviesError,
    loadMore: loadMoreMovies,
    refetch: refetchMovies,
    isEndReached: moviesEndReached,
  } = useMovies({
    search: debouncedSearch,
    limit: 20,
  });

  const {
    series,
    isLoading: seriesLoading,
    isFetching: seriesFetching,
    error: seriesError,
    loadMore: loadMoreSeries,
    refetch: refetchSeries,
    isEndReached: seriesEndReached,
  } = useSeries({
    search: debouncedSearch,
    limit: 20,
  });

  const {
    channels,
    isLoading: liveTvLoading,
    isFetching: liveTvFetching,
    error: liveTvError,
    loadMore: loadMoreLiveTv,
    refetch: refetchLiveTv,
    isEndReached: liveTvEndReached,
  } = useLiveTv({
    search: debouncedSearch,
    limit: 20,
  });

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case "Movies":
        return movies;
      case "Series":
        return series;
      case "Live TV":
        return channels;
      default:
        return [];
    }
  };

  // Get current loading state
  const getCurrentLoading = () => {
    switch (activeTab) {
      case "Movies":
        return moviesLoading;
      case "Series":
        return seriesLoading;
      case "Live TV":
        return liveTvLoading;
      default:
        return false;
    }
  };

  // Get current error state
  const getCurrentError = () => {
    switch (activeTab) {
      case "Movies":
        return moviesError;
      case "Series":
        return seriesError;
      case "Live TV":
        return liveTvError;
      default:
        return null;
    }
  };

  // Get current fetching state
  const getCurrentFetching = () => {
    switch (activeTab) {
      case "Movies":
        return moviesFetching;
      case "Series":
        return seriesFetching;
      case "Live TV":
        return liveTvFetching;
      default:
        return false;
    }
  };

  // Get current end reached state
  const getCurrentEndReached = () => {
    switch (activeTab) {
      case "Movies":
        return moviesEndReached;
      case "Series":
        return seriesEndReached;
      case "Live TV":
        return liveTvEndReached;
      default:
        return true;
    }
  };

  // Get current load more function
  const getCurrentLoadMore = () => {
    switch (activeTab) {
      case "Movies":
        return loadMoreMovies;
      case "Series":
        return loadMoreSeries;
      case "Live TV":
        return loadMoreLiveTv;
      default:
        return () => {};
    }
  };

  const handleResultPress = (item: any) => {
    setSelectedResult(item._id);
    console.log("Result pressed:", item.title || item.name);
    
    // Navigate to appropriate detail page using state management
    switch (activeTab) {
      case "Movies":
        setSelectedMovie(item);
        setShowMovieInfo(true);
        break;
      case "Series":
        setSelectedSeries(item);
        setShowSeriesInfo(true);
        break;
      case "Live TV":
        setSelectedLiveTv(item);
        setShowLiveTvInfo(true);
        break;
    }
  };

  // Back press handlers
  const handleMovieInfoBackPress = () => {
    setShowMovieInfo(false);
    setSelectedMovie(null);
  };

  const handleSeriesInfoBackPress = () => {
    setShowSeriesInfo(false);
    setSelectedSeries(null);
  };

  const handleLiveTvInfoBackPress = () => {
    setShowLiveTvInfo(false);
    setSelectedLiveTv(null);
  };

  const currentData = getCurrentData();
  const currentLoading = getCurrentLoading();
  const currentError = getCurrentError();
  const currentFetching = getCurrentFetching();
  const currentEndReached = getCurrentEndReached();
  const currentLoadMore = getCurrentLoadMore();

  // Show movie info page if selected
  if (showMovieInfo && selectedMovie) {
    return <MovieInfoPage onBackPress={handleMovieInfoBackPress} movieId={selectedMovie._id} onVideoPlayerOpen={onVideoPlayerOpen} />;
  }

  // Show series info page if selected
  if (showSeriesInfo && selectedSeries) {
    return <SeriesInfoPage onBackPress={handleSeriesInfoBackPress} seriesId={selectedSeries._id} onVideoPlayerOpen={onVideoPlayerOpen} />;
  }

  // Show live TV info page if selected
  if (showLiveTvInfo && selectedLiveTv) {
    return <LiveTvInfoPage onBackPress={handleLiveTvInfoBackPress} streamId={selectedLiveTv.stream_id} channelData={selectedLiveTv} onVideoPlayerOpen={onVideoPlayerOpen} />;
  }

  // Check if any API call has failed
  const hasError = currentError;
  const isLoading = currentLoading;

  return (
    <ErrorScreenWrapper
      error={hasError}
      isLoading={isLoading}
      onRetry={() => {
        switch (activeTab) {
          case "Movies":
            refetchMovies();
            break;
          case "Series":
            refetchSeries();
            break;
          case "Live TV":
            refetchLiveTv();
            break;
        }
      }}
      serverErrorMessage="Failed to load search results. Please check your connection and try again."
      offlineMessage="You're offline. Please check your internet connection to search content."
    >
      <KeyboardDismissWrapper style={styles.container}>
        <LinearGradient
          colors={["rgba(0, 0, 0, 1)", "rgb(22, 0, 0)", "rgb(66, 0, 0)", "rgb(16, 0, 0)", "#000000"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          locations={[0, 0.2, 0.5, 0.8, 1]}
          style={styles.gradientBackground}
        >
          {/* Search Bar */}
          <View style={[styles.searchContainer, { paddingTop: insets.top - 20 }]}>
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>
                <Search size={getResponsiveIconSize(20)} color="#ffffff" /> 
              </Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search movies, series, channels..."
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TabButton
              title="Movies"
              isActive={activeTab === "Movies"}
              onPress={() => setActiveTab("Movies")}
            />
            <TabButton
              title="Series"
              isActive={activeTab === "Series"}
              onPress={() => setActiveTab("Series")}
            />
            <TabButton
              title="Live TV"
              isActive={activeTab === "Live TV"}
              onPress={() => setActiveTab("Live TV")}
            />
          </View>

          {/* Search Results */}
          <View style={styles.resultsContainer}>
            {currentLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#420000" />
                <Text style={styles.loadingText}>Loading {activeTab.toLowerCase()}...</Text>
              </View>
            ) : (
              <FlatList
                data={currentData}
                renderItem={({ item }) => (
                  <SearchResultItem
                    key={item._id}
                    item={item}
                    contentType={activeTab}
                    onPress={() => handleResultPress(item)}
                    isSelected={selectedResult === item._id}
                  />
                )}
                keyExtractor={(item, index) => `${item._id}-${index}`}
                showsVerticalScrollIndicator={false}
                onEndReached={currentLoadMore}
                onEndReachedThreshold={0.5}
                contentContainerStyle={styles.resultsContent}
                ListFooterComponent={() => (
                  <View style={styles.footerContainer}>
                    {currentFetching && !currentLoading ? (
                      <ActivityIndicator size="small" color="#420000" />
                    ) : currentEndReached && currentData.length > 0 ? (
                      <Text style={styles.endMessage}>No more {activeTab.toLowerCase()} to load</Text>
                    ) : null}
                  </View>
                )}
                ListEmptyComponent={() => (
                  <EmptySearchResults 
                    searchQuery={searchQuery} 
                    contentType={activeTab} 
                  />
                )}
              />
            )}
          </View>
        </LinearGradient>
      </KeyboardDismissWrapper>
    </ErrorScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  gradientBackground: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  searchContainer: {
    paddingHorizontal: getResponsivePadding(20),
    marginBottom: getResponsiveSpacing(24),
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: getResponsiveSpacing(12),
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(8),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  searchIcon: {
    fontSize: responsiveStyles.caption.fontSize,
    marginRight: getResponsiveSpacing(12),
    color: "rgba(255, 255, 255, 0.6)",
  },
  searchInput: {
    flex: 1,
    fontSize: responsiveStyles.body.fontSize,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: getResponsivePadding(20),
    marginBottom: getResponsiveSpacing(24),
    gap: getResponsiveSpacing(8),
  },
  tabButton: {
    flex: 1,
    paddingVertical: getResponsivePadding(12),
    paddingHorizontal: getResponsivePadding(20),
    borderRadius: getResponsiveSpacing(20),
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  activeTab: {
    backgroundColor: "rgba(66, 0, 0, 0.2)",
    borderColor: "rgba(66, 0, 0, 0.3)",
  },
  tabText: {
    fontSize: responsiveStyles.caption.fontSize,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContent: {
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsiveSpacing(40), // Reduced from 80 to 40
  },
  sectionHeader: {
    marginBottom: getResponsiveSpacing(16),
    marginTop: getResponsiveSpacing(8),
  },
  sectionTitle: {
    fontSize: responsiveStyles.subtitle.fontSize,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  resultItem: {
    flexDirection: "row",
    paddingVertical: getResponsivePadding(16),
    paddingHorizontal: getResponsivePadding(16),
    borderRadius: getResponsiveSpacing(12),
    marginBottom: getResponsiveSpacing(8),
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  selectedResultItem: {
    backgroundColor: "rgba(66, 0, 0, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(66, 0, 0, 0.2)",
  },
  resultThumbnail: {
    width: getResponsiveIconSize(60),
    height: getResponsiveIconSize(60),
    borderRadius: getResponsiveSpacing(8),
    backgroundColor: "#2a2a2a",
    marginRight: getResponsiveSpacing(16),
  },
  placeholderThumbnail: {
    width: getResponsiveIconSize(60),
    height: getResponsiveIconSize(60),
    borderRadius: getResponsiveSpacing(8),
    backgroundColor: "#2a2a2a",
    marginRight: getResponsiveSpacing(16),
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderIcon: {
    fontSize: responsiveStyles.subtitle.fontSize,
    color: "rgba(255, 255, 255, 0.6)",
  },
  resultContent: {
    flex: 1,
    justifyContent: "center",
  },
  resultTitle: {
    fontSize: responsiveStyles.body.fontSize,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: getResponsiveSpacing(4),
  },
  resultMetadata: {
    fontSize: responsiveStyles.caption.fontSize,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: getResponsiveSpacing(40),
  },
  loadingText: {
    fontSize: responsiveStyles.caption.fontSize,
    color: "rgba(255, 255, 255, 0.6)",
    fontStyle: "italic",
    marginTop: getResponsiveSpacing(16),
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: getResponsiveSpacing(40),
  },
  errorText: {
    fontSize: responsiveStyles.caption.fontSize,
    color: "#FF6B6B",
    fontStyle: "italic",
    marginBottom: getResponsiveSpacing(16),
  },
  retryButton: {
    backgroundColor: "#420000",
    paddingHorizontal: getResponsivePadding(20),
    paddingVertical: getResponsivePadding(10),
    borderRadius: getResponsiveSpacing(8),
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: getResponsiveSpacing(40),
  },
  emptyText: {
    fontSize: responsiveStyles.body.fontSize,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
  },
  footerContainer: {
    paddingVertical: getResponsivePadding(20),
    alignItems: "center",
  },
  endMessage: {
    fontSize: responsiveStyles.caption.fontSize,
    color: "rgba(255, 255, 255, 0.6)",
    fontStyle: "italic",
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