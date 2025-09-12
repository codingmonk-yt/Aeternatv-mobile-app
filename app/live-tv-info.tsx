import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

const { width, height } = Dimensions.get("window");

interface LiveTvInfoPageProps {
  onBackPress?: () => void;
  channelData?: {
    id: number;
    title: string;
    platform: string;
    imageUrl: string;
    category?: string;
    description?: string;
    currentShow?: {
      title: string;
      time: string;
      description: string;
      genre: string;
    };
    upcomingShows?: Array<{
      title: string;
      time: string;
      description: string;
      genre: string;
    }>;
    isLive?: boolean;
    viewers?: string;
  };
}

export default function LiveTvInfoPage({
  onBackPress,
  channelData,
}: LiveTvInfoPageProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Default channel data if none provided
  const channel = channelData || {
    id: 1,
    title: "CNN",
    platform: "Live TV",
    imageUrl: "https://download.logo.wine/logo/CNN/CNN-Logo.wine.png",
    category: "News",
    description:
      "CNN is a multinational news-based pay television channel headquartered in Atlanta, Georgia. CNN is widely credited with introducing the concept of 24-hour news coverage.",
    currentShow: {
      title: "CNN Newsroom",
      time: "2:00 PM - 4:00 PM",
      description: "Breaking news and live updates from around the world.",
      genre: "News",
    },
    upcomingShows: [
      {
        title: "Anderson Cooper 360°",
        time: "4:00 PM - 5:00 PM",
        description: "In-depth analysis and interviews with Anderson Cooper.",
        genre: "News",
      },
      {
        title: "The Lead with Jake Tapper",
        time: "5:00 PM - 6:00 PM",
        description: "Political news and analysis with Jake Tapper.",
        genre: "News",
      },
      {
        title: "Situation Room",
        time: "6:00 PM - 7:00 PM",
        description: "Breaking news and political coverage.",
        genre: "News",
      },
      {
        title: "Erin Burnett OutFront",
        time: "7:00 PM - 8:00 PM",
        description: "News analysis and interviews with Erin Burnett.",
        genre: "News",
      },
    ],
    isLive: true,
    viewers: "2.4M",
  };

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handlePlayPress = () => {
    console.log("Play button pressed for:", channel.title);
    // TODO: Navigate to live TV player
  };

  const handleSharePress = async () => {
    try {
      const result = await Share.share({
        message: `Check out "${channel.title}" - ${channel.currentShow?.title} is now live!`,
        title: channel.title,
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

  const truncatedDescription =
    channel.description && channel.description.length > 150
      ? channel.description.substring(0, 150) + "..."
      : channel.description;

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
              source={{ uri: channel.imageUrl }}
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
          <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleSharePress}
              >
                <Text style={styles.actionIcon}>↗</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleBookmarkPress}
              >
                <Text style={styles.actionIcon}>♡</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Platform Logo */}
          <View style={styles.platformLogo}>
            <Text style={styles.platformText}>{channel.platform}</Text>
          </View>

          {/* Live Status Indicator */}
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
            <Text style={styles.viewersText}>{channel.viewers} watching</Text>
          </View>

          {/* Play Button */}
          <TouchableOpacity style={styles.playButton} onPress={handlePlayPress}>
            <LinearGradient
              colors={["#FF4444", "#CC0000"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.playButtonGradient}
            >
              <Text style={styles.playIcon}>▶</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Channel Details */}
        <View style={styles.channelDetails}>
          <Text style={styles.channelTitleText}>{channel.title}</Text>
          <Text style={styles.categoryText}>{channel.category}</Text>

          {/* Info Boxes */}
          <View style={styles.infoBoxes}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={styles.infoValue}>🔴 Live</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Viewers</Text>
              <Text style={styles.infoValue}>{channel.viewers}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>{channel.category}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>
              {showFullDescription ? channel.description : truncatedDescription}
            </Text>
            {channel.description && channel.description.length > 150 && (
              <TouchableOpacity
                onPress={() => setShowFullDescription(!showFullDescription)}
              >
                <Text style={styles.readMoreText}>
                  {showFullDescription ? "Read less" : "Read more"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Current Show */}
          {channel.currentShow && (
            <View style={styles.currentShowContainer}>
              <Text style={styles.sectionTitle}>Currently Playing</Text>
              <View style={styles.currentShowCard}>
                <View style={styles.currentShowHeader}>
                  <Text style={styles.currentShowTitle}>
                    {channel.currentShow.title}
                  </Text>
                  <Text style={styles.currentShowTime}>
                    {channel.currentShow.time}
                  </Text>
                </View>
                <Text style={styles.currentShowGenre}>
                  {channel.currentShow.genre}
                </Text>
                <Text style={styles.currentShowDescription}>
                  {channel.currentShow.description}
                </Text>
              </View>
            </View>
          )}

          {/* Program Guide */}
          <View style={styles.programGuideContainer}>
            <Text style={styles.sectionTitle}>Program Guide</Text>
            {channel.upcomingShows?.map((show, index) => (
              <View key={index} style={styles.programItem}>
                <View style={styles.programTime}>
                  <Text style={styles.programTimeText}>{show.time}</Text>
                </View>
                <View style={styles.programDetails}>
                  <Text style={styles.programTitle}>{show.title}</Text>
                  <Text style={styles.programGenre}>{show.genre}</Text>
                  <Text style={styles.programDescription}>{show.description}</Text>
                </View>
              </View>
            ))}
          </View>
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
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    paddingVertical: 6,
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
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
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
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF4444",
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
    color: "#FFFFFF",
    marginLeft: 2,
  },
  channelDetails: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    backgroundColor: "#000000",
    paddingTop: 20,
  },
  channelTitleText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 20,
  },
  infoBoxes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  descriptionContainer: {
    marginBottom: 32,
  },
  descriptionText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 24,
    marginBottom: 8,
  },
  readMoreText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textDecorationLine: "underline",
  },
  currentShowContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  currentShowCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
    marginRight: 12,
  },
  currentShowTime: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "600",
  },
  currentShowGenre: {
    fontSize: 14,
    color: "#FF4444",
    fontWeight: "600",
    marginBottom: 8,
  },
  currentShowDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
  },
  programGuideContainer: {
    marginBottom: 20,
  },
  programItem: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  programTime: {
    width: 80,
    marginRight: 16,
  },
  programTimeText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "600",
  },
  programDetails: {
    flex: 1,
  },
  programTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  programGenre: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 4,
  },
  programDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 18,
  },
});
