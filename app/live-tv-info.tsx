import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ChevronLeft, Share2 } from "lucide-react-native";
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
import { useEpg } from "../src/hooks/useEpg";
import { useOrientationLock } from "../src/hooks/useOrientationLock";
import { useGetLiveTvStreamUrlQuery } from "../src/store/api/apiSlice";
import { getResponsiveIconSize, getResponsivePadding, getResponsiveSpacing, responsiveStyles } from "../src/utils/responsive";

const { width, height } = Dimensions.get("window");

interface LiveTvInfoPageProps {
  onBackPress?: () => void;
  streamId?: string;
  channelData?: {
    _id: string;
    name: string;
    stream_id: number;
    stream_icon: string;
    category_id?: string;
    status?: string;
    provider?: string;
    [key: string]: any;
  };
  onVideoPlayerOpen?: (title?: string, videoUrl?: string) => void;
}

export default function LiveTvInfoPage({
  onBackPress,
  streamId,
  channelData,
  onVideoPlayerOpen,
}: LiveTvInfoPageProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  
  // Lock orientation to portrait
  useOrientationLock();

  // Fetch EPG data
  const {
    epgListings,
    providerName,
    isLoading: epgLoading,
    error: epgError,
  } = useEpg({
    streamId: streamId || "",
    enabled: !!streamId,
  });

  // Default channel data if none provided
  const channel = channelData || {
    _id: "1",
    name: "CNN",
    stream_id: 1,
    stream_icon: "https://download.logo.wine/logo/CNN/CNN-Logo.wine.png",
    category_id: "News",
    status: "ACTIVE",
  };

  // Live TV Stream URL API call - only trigger when we have provider and stream_id
  const { 
    data: liveTvStreamData, 
    isLoading: isLiveTvStreamLoading, 
    error: liveTvStreamError,
    refetch: refetchLiveTvStream 
  } = useGetLiveTvStreamUrlQuery(
    { 
      providerId: channelData?.provider || '', 
      streamId: channelData?.stream_id?.toString() || '' 
    },
    { 
      skip: !channelData?.provider || !channelData?.stream_id || !showVideoPlayer 
    }
  );

  // Handle live TV stream URL response
  React.useEffect(() => {
    if (liveTvStreamData?.success && liveTvStreamData.streamUrl) {
      setStreamUrl(liveTvStreamData.streamUrl);
    }
  }, [liveTvStreamData]);

  // Handle video player opening when stream URL is ready
  React.useEffect(() => {
    if (showVideoPlayer && streamUrl && onVideoPlayerOpen && channel) {
      onVideoPlayerOpen(channel.name, streamUrl);
    }
  }, [showVideoPlayer, streamUrl, onVideoPlayerOpen, channel]);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handlePlayPress = () => {
    console.log("Play button pressed for:", channel.name);
    console.log("Provider:", channelData?.provider);
    console.log("Stream ID:", channelData?.stream_id);
    
    // Trigger stream URL API call
    setShowVideoPlayer(true);
  };

  const handleCloseVideoPlayer = () => {
    setShowVideoPlayer(false);
    setStreamUrl(null);
  };

  const handleSharePress = async () => {
    try {
      const currentShow = epgListings[0];
      const message = currentShow
        ? `Check out "${channel.name}" - ${currentShow.title_decoded} is now live!`
        : `Check out "${channel.name}" - Live TV`;

      const result = await Share.share({
        message,
        title: channel.name,
      });

      if (result.action === Share.sharedAction) {
        console.log("Content shared successfully");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to share content");
      console.error("Share error:", error);
    }
  };

  const handleBookmarkPress = () => {
    console.log("Bookmark button pressed");
    // TODO: Implement bookmark functionality
  };

  // Utility functions for EPG data
  const formatTime = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getCurrentShow = () => {
    const now = Math.floor(Date.now() / 1000);
    return epgListings.find((show) => {
      const start = parseInt(show.start_timestamp);
      const end = parseInt(show.stop_timestamp);
      return now >= start && now <= end;
    });
  };

  const getUpcomingShows = () => {
    const now = Math.floor(Date.now() / 1000);
    return epgListings
      .filter((show) => parseInt(show.start_timestamp) > now)
      .slice(0, 5);
  };

  const currentShow = getCurrentShow();
  const upcomingShows = getUpcomingShows();

  // Show loading state when fetching stream URL
  if (showVideoPlayer && isLiveTvStreamLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading live stream...</Text>
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
  if (showVideoPlayer && liveTvStreamError) {
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
          <Text style={styles.errorTitle}>Failed to load live stream</Text>
          <Text style={styles.errorMessage}>
            Unable to get live stream. Please try again.
          </Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => refetchLiveTvStream()}
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
        {/* Channel Banner - Full Screen from Top */}
        <View style={[styles.posterContainer, { paddingTop: insets.top }]}>
          {/* Image with Gradient Overlay */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: channel.stream_icon }}
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

          {/* Header with back button and action buttons */}
          <View style={[styles.header, { paddingTop: insets.top }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Text style={styles.backIcon}>
                <ChevronLeft color="#ffffff" size={getResponsiveIconSize(20)} />
              </Text>
            </TouchableOpacity>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleSharePress}
              >
                <Text style={styles.actionIcon}>
                  <Share2 color="#ffffff" size={getResponsiveIconSize(20)} />
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Play Button - Removed from here, will be floating at bottom */}
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
              <Text style={styles.playIcon}>▶</Text>
              <Text style={styles.playText}>Play</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Channel Details */}
        <View style={styles.channelDetails}>
          <Text style={styles.channelTitleText}>{channel.name}</Text>
          <Text style={styles.categoryText}>Channel ID: {channel.stream_id}</Text>

          {/* EPG Loading State */}
          {epgLoading && (
            <View style={styles.epgLoadingContainer}>
              <ActivityIndicator size="small" color="#420000" />
              <Text style={styles.epgLoadingText}>
                Loading program guide...
              </Text>
            </View>
          )}

          {/* EPG Error State */}
          {epgError && (
            <View style={styles.epgErrorContainer}>
              <Text style={styles.epgErrorText}>
                Failed to load program guide
              </Text>
            </View>
          )}

          {/* Current Show */}
          {currentShow && (
            <View style={styles.currentShowContainer}>
              <Text style={styles.sectionTitle}>Currently Playing</Text>
              <View style={styles.currentShowCard}>
                <View style={styles.currentShowHeader}>
                  <Text style={styles.currentShowTitle}>
                    {currentShow.title_decoded}
                  </Text>
                  <Text style={styles.currentShowTime}>
                    {formatTime(currentShow.start_timestamp)} -{" "}
                    {formatTime(currentShow.stop_timestamp)}
                  </Text>
                </View>
                <Text style={styles.currentShowGenre}>
                  {formatDate(currentShow.start_timestamp)}
                </Text>
                <Text style={styles.currentShowDescription}>
                  {currentShow.description_decoded}
                </Text>
              </View>
            </View>
          )}

          {/* Program Guide */}
          {upcomingShows.length > 0 && (
            <View style={styles.programGuideContainer}>
              <Text style={styles.sectionTitle}>Upcoming Programs</Text>
              {upcomingShows.map((show, index) => (
                <View key={show.id} style={styles.programItem}>
                  <View style={styles.programTime}>
                    <Text style={styles.programTimeText}>
                      {formatTime(show.start_timestamp)}
                    </Text>
                    <Text style={styles.programDateText}>
                      {formatDate(show.start_timestamp)}
                    </Text>
                  </View>
                  <View style={styles.programDetails}>
                    <Text style={styles.programTitle}>
                      {show.title_decoded}
                    </Text>
                    <Text style={styles.programDuration}>
                      {formatTime(show.start_timestamp)} -{" "}
                      {formatTime(show.stop_timestamp)}
                    </Text>
                    <Text style={styles.programDescription}>
                      {show.description_decoded}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* No EPG Data */}
          {!epgLoading && !epgError && epgListings.length === 0 && (
            <View style={styles.noEpgContainer}>
              <Text style={styles.noEpgText}>No program guide available</Text>
            </View>
          )}
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
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 24,
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
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionIcon: {
    fontSize: 18,
    color: "#FFFFFF",
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
  liveIndicator: {
    position: "absolute",
    top: 100,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 6,
    zIndex: 5,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF4444",
    marginRight: 6,
  },
  liveText: {
    color: "#FF4444",
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 8,
  },
  viewersText: {
    color: "#FFFFFF",
    fontSize: 10,
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
  channelDetails: {
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsiveSpacing(100),
    backgroundColor: "#000000",
    paddingTop: getResponsiveSpacing(50), // Added back vertical padding
  },
  channelTitleText: {
    fontSize: responsiveStyles.title.fontSize,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: getResponsiveSpacing(8),
  },
  categoryText: {
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
  descriptionContainer: {
    marginBottom: getResponsiveSpacing(32),
  },
  descriptionText: {
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
  currentShowContainer: {
    marginBottom: getResponsiveSpacing(32),
  },
  sectionTitle: {
    fontSize: responsiveStyles.subtitle.fontSize,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: getResponsiveSpacing(16),
  },
  currentShowCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: getResponsiveSpacing(12),
    padding: getResponsivePadding(16),
    borderLeftWidth: 4,
    borderLeftColor: "#FF4444",
  },
  currentShowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  currentShowTitle: {
    fontSize: responsiveStyles.body.fontSize,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
    marginRight: getResponsiveSpacing(12),
  },
  currentShowTime: {
    fontSize: responsiveStyles.caption.fontSize,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "600",
  },
  currentShowGenre: {
    fontSize: responsiveStyles.caption.fontSize,
    color: "#FF4444",
    fontWeight: "600",
    marginBottom: getResponsiveSpacing(8),
  },
  currentShowDescription: {
    fontSize: responsiveStyles.caption.fontSize,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
  },
  programGuideContainer: {
    marginBottom: getResponsiveSpacing(20),
  },
  programItem: {
    flexDirection: "row",
    paddingVertical: getResponsivePadding(16),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  programTime: {
    width: 80,
    marginRight: getResponsiveSpacing(16),
  },
  programTimeText: {
    fontSize: responsiveStyles.caption.fontSize,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "600",
  },
  programDetails: {
    flex: 1,
  },
  programTitle: {
    fontSize: responsiveStyles.body.fontSize,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: getResponsiveSpacing(4),
  },
  programGenre: {
    fontSize: responsiveStyles.small.fontSize,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: getResponsiveSpacing(4),
  },
  programDescription: {
    fontSize: responsiveStyles.caption.fontSize,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 18,
  },
  programDateText: {
    fontSize: responsiveStyles.tiny.fontSize,
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: getResponsiveSpacing(2),
  },
  programDuration: {
    fontSize: responsiveStyles.small.fontSize,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: getResponsiveSpacing(4),
  },
  epgLoadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: getResponsivePadding(20),
    marginBottom: getResponsiveSpacing(20),
  },
  epgLoadingText: {
    fontSize: responsiveStyles.caption.fontSize,
    color: "rgba(255, 255, 255, 0.6)",
    marginLeft: getResponsiveSpacing(8),
  },
  epgErrorContainer: {
    alignItems: "center",
    paddingVertical: getResponsivePadding(20),
    marginBottom: getResponsiveSpacing(20),
  },
  epgErrorText: {
    fontSize: responsiveStyles.caption.fontSize,
    color: "#FF6B6B",
    fontStyle: "italic",
  },
  noEpgContainer: {
    alignItems: "center",
    paddingVertical: getResponsivePadding(20),
    marginBottom: getResponsiveSpacing(20),
  },
  noEpgText: {
    fontSize: responsiveStyles.caption.fontSize,
    color: "rgba(255, 255, 255, 0.6)",
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
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
