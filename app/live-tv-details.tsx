import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = (width - 60) / 3; // 3 columns with margins

interface LiveTvCardProps {
  title: string;
  platform: string;
  imageUrl: string;
  onPress: () => void;
}

function LiveTvCard({ title, platform, imageUrl, onPress }: LiveTvCardProps) {
  return (
    <TouchableOpacity
      style={styles.liveTvCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={{ uri: imageUrl }} style={styles.liveTvImage} />
      <View style={styles.liveTvOverlay}>
        <Text style={styles.liveTvTitle}>{title}</Text>
        <Text style={styles.liveTvPlatform}>{platform}</Text>
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

interface LiveTvDetailsPageProps {
  onBackPress?: () => void;
}

export default function LiveTvDetailsPage({
  onBackPress,
}: LiveTvDetailsPageProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("Live");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "Live",
    "News",
    "Sports",
    "Entertainment",
    "Documentary",
    "Kids",
    "Music",
    "Lifestyle",
    "Educational",
    "International",
    "Local",
    "Premium",
  ];

  const liveTvChannels = [
    {
      id: 1,
      title: "CNN",
      platform: "Live TV",
      imageUrl: "https://download.logo.wine/logo/CNN/CNN-Logo.wine.png",
    },
    {
      id: 2,
      title: "ESPN",
      platform: "Live TV",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/6/60/ESPN_logos.png",
    },
    {
      id: 3,
      title: "BBC News",
      platform: "Live TV",
      imageUrl: "https://download.logo.wine/logo/BBC/BBC-Logo.wine.png",
    },
    {
      id: 4,
      title: "Discovery",
      platform: "Live TV",
      imageUrl:
        "https://logos-world.net/wp-content/uploads/2022/01/Discovery-Channel-Logo.png",
    },
    {
      id: 5,
      title: "MTV",
      platform: "Live TV",
      imageUrl:
        "https://cdn.freebiesupply.com/images/large/2x/mtv-logo-png-transparent.png",
    },
    {
      id: 6,
      title: "National Geographic",
      platform: "Live TV",
      imageUrl:
        "https://logos-world.net/wp-content/uploads/2020/09/National-Geographic-Logo.png",
    },
    {
      id: 7,
      title: "HBO",
      platform: "Live TV",
      imageUrl:
        "https://logos-world.net/wp-content/uploads/2020/09/HBO-Emblem.png",
    },
    {
      id: 8,
      title: "Fox News",
      platform: "Live TV",
      imageUrl:
        "https://www.hatchwise.com/wp-content/uploads/2023/08/Fox-News-Channel-Emblem-1024x576.png",
    },
    {
      id: 9,
      title: "Cartoon Network",
      platform: "Live TV",
      imageUrl:
        "https://yt3.googleusercontent.com/1Cqc3xwwMDAp_tZlbXRL4u8bKLzprzS-oGluxBS_hH-BUCVBAi9f-XsVceF2bWrf15UYIf_-rg=s900-c-k-c0x00ffffff-no-rj",
    },
    {
      id: 10,
      title: "Comedy Central",
      platform: "Live TV",
      imageUrl:
        "https://1000logos.net/wp-content/uploads/2021/05/Comedy-Central-logo.png",
    },
    {
      id: 11,
      title: "History Channel",
      platform: "Live TV",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/History_%282021%29.svg/250px-History_%282021%29.svg.png",
    },
    {
      id: 12,
      title: "Food Network",
      platform: "Live TV",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Food_Network_logo.svg/1200px-Food_Network_logo.svg.png",
    },
    {
      id: 13,
      title: "TLC",
      platform: "Live TV",
      imageUrl: "https://cdn.freebiesupply.com/logos/thumbs/2x/tlc-10-logo.png",
    },
    {
      id: 14,
      title: "Animal Planet",
      platform: "Live TV",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/2018_Animal_Planet_logo.svg/2560px-2018_Animal_Planet_logo.svg.png",
    },
    {
      id: 15,
      title: "FX",
      platform: "Live TV",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/4/4d/FX_International_logo.svg",
    },
  ];

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleLiveTvPress = (channel: any) => {
    console.log("Live TV pressed:", channel.title);
    // TODO: Navigate to live TV player
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#000000", "#110546", "#0B033A", "#110546", "#000000"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.4, 0.6, 0.7, 1]}
        style={styles.gradientBackground}
      >
        {/* Sticky Header */}
        <View style={styles.stickyHeader}>
          {/* Header with back button and title */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Live TV</Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search channels, shows ..."
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

        {/* Scrollable Live TV Grid */}
        <ScrollView
          style={styles.scrollableContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
        >
          <View style={styles.liveTvGrid}>
            {liveTvChannels.map((channel) => (
              <LiveTvCard
                key={channel.id}
                title={channel.title}
                platform={channel.platform}
                imageUrl={channel.imageUrl}
                onPress={() => handleLiveTvPress(channel)}
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 1)",
    backdropFilter: "blur(10px)",
  },
  scrollableContent: {
    flex: 1,
    marginTop: 200,
  },
  scrollContentContainer: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  backIcon: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "300",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginRight: 12,
  },
  activeChip: {
    backgroundColor: "#A259FF",
  },
  chipText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  activeChipText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  liveTvGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingTop: 30,
  },
  liveTvCard: {
    width: cardWidth,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  liveTvImage: {
    width: "100%",
    height: cardWidth * 1.5,
    objectFit: "contain",
    backgroundColor: "#2a2a2a",
  },
  liveTvOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 8,
  },
  liveTvTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  liveTvPlatform: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.7)",
  },
});
