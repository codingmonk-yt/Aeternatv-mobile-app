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
import LiveTvInfoPage from "./live-tv-info";

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
  const [showLiveTvInfo, setShowLiveTvInfo] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);

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
      category: "News",
      description: "CNN is a multinational news-based pay television channel headquartered in Atlanta, Georgia. CNN is widely credited with introducing the concept of 24-hour news coverage.",
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
      ],
      isLive: true,
      viewers: "2.4M",
    },
    {
      id: 2,
      title: "ESPN",
      platform: "Live TV",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/60/ESPN_logos.png",
      category: "Sports",
      description: "ESPN is an American multinational basic cable sports channel owned by ESPN Inc., owned jointly by The Walt Disney Company and Hearst Communications.",
      currentShow: {
        title: "SportsCenter",
        time: "2:00 PM - 3:00 PM",
        description: "The latest sports news, highlights, and analysis.",
        genre: "Sports",
      },
      upcomingShows: [
        {
          title: "NBA Today",
          time: "3:00 PM - 4:00 PM",
          description: "NBA news, highlights, and analysis.",
          genre: "Sports",
        },
        {
          title: "NFL Live",
          time: "4:00 PM - 5:00 PM",
          description: "NFL news and analysis.",
          genre: "Sports",
        },
      ],
      isLive: true,
      viewers: "1.8M",
    },
    {
      id: 3,
      title: "BBC News",
      platform: "Live TV",
      imageUrl: "https://download.logo.wine/logo/BBC/BBC-Logo.wine.png",
      category: "News",
      description: "BBC News is the news and current affairs division of the British Broadcasting Corporation.",
      currentShow: {
        title: "BBC World News",
        time: "2:00 PM - 3:00 PM",
        description: "International news and current affairs.",
        genre: "News",
      },
      upcomingShows: [
        {
          title: "BBC News at Six",
          time: "6:00 PM - 6:30 PM",
          description: "Evening news bulletin.",
          genre: "News",
        },
      ],
      isLive: true,
      viewers: "1.2M",
    },
    {
      id: 4,
      title: "Discovery",
      platform: "Live TV",
      imageUrl: "https://logos-world.net/wp-content/uploads/2022/01/Discovery-Channel-Logo.png",
      category: "Documentary",
      description: "Discovery Channel is an American pay television channel owned by Warner Bros. Discovery.",
      currentShow: {
        title: "MythBusters",
        time: "2:00 PM - 3:00 PM",
        description: "Testing urban legends and myths with science.",
        genre: "Documentary",
      },
      upcomingShows: [
        {
          title: "Deadliest Catch",
          time: "3:00 PM - 4:00 PM",
          description: "Follow crab fishermen in the Bering Sea.",
          genre: "Documentary",
        },
      ],
      isLive: true,
      viewers: "890K",
    },
    {
      id: 5,
      title: "MTV",
      platform: "Live TV",
      imageUrl: "https://cdn.freebiesupply.com/images/large/2x/mtv-logo-png-transparent.png",
      category: "Entertainment",
      description: "MTV is an American cable channel that was originally established to play music videos.",
      currentShow: {
        title: "Ridiculousness",
        time: "2:00 PM - 3:00 PM",
        description: "Funny viral videos with celebrity commentary.",
        genre: "Entertainment",
      },
      upcomingShows: [
        {
          title: "Catfish: The TV Show",
          time: "3:00 PM - 4:00 PM",
          description: "Help people uncover online dating deceptions.",
          genre: "Entertainment",
        },
      ],
      isLive: true,
      viewers: "650K",
    },
    {
      id: 6,
      title: "National Geographic",
      platform: "Live TV",
      imageUrl: "https://logos-world.net/wp-content/uploads/2020/09/National-Geographic-Logo.png",
      category: "Documentary",
      description: "National Geographic Channel is an American pay television network and flagship channel owned by National Geographic Partners.",
      currentShow: {
        title: "Planet Earth",
        time: "2:00 PM - 3:00 PM",
        description: "Explore the natural world in stunning detail.",
        genre: "Documentary",
      },
      upcomingShows: [
        {
          title: "Blue Planet",
          time: "3:00 PM - 4:00 PM",
          description: "Discover the mysteries of the ocean depths.",
          genre: "Documentary",
        },
      ],
      isLive: true,
      viewers: "1.1M",
    },
    {
      id: 7,
      title: "HBO",
      platform: "Live TV",
      imageUrl: "https://logos-world.net/wp-content/uploads/2020/09/HBO-Emblem.png",
      category: "Entertainment",
      description: "HBO is an American premium cable and satellite television network.",
      currentShow: {
        title: "Game of Thrones Marathon",
        time: "2:00 PM - 6:00 PM",
        description: "Epic fantasy series marathon.",
        genre: "Entertainment",
      },
      upcomingShows: [
        {
          title: "Westworld",
          time: "6:00 PM - 7:00 PM",
          description: "Sci-fi series about artificial consciousness.",
          genre: "Entertainment",
        },
      ],
      isLive: true,
      viewers: "2.1M",
    },
    {
      id: 8,
      title: "Fox News",
      platform: "Live TV",
      imageUrl: "https://www.hatchwise.com/wp-content/uploads/2023/08/Fox-News-Channel-Emblem-1024x576.png",
      category: "News",
      description: "Fox News is an American multinational conservative cable news television channel.",
      currentShow: {
        title: "Fox News Live",
        time: "2:00 PM - 3:00 PM",
        description: "Breaking news and political coverage.",
        genre: "News",
      },
      upcomingShows: [
        {
          title: "The Five",
          time: "5:00 PM - 6:00 PM",
          description: "Political talk show with five hosts.",
          genre: "News",
        },
      ],
      isLive: true,
      viewers: "1.9M",
    },
    {
      id: 9,
      title: "Cartoon Network",
      platform: "Live TV",
      imageUrl: "https://yt3.googleusercontent.com/1Cqc3xwwMDAp_tZlbXRL4u8bKLzprzS-oGluxBS_hH-BUCVBAi9f-XsVceF2bWrf15UYIf_-rg=s900-c-k-c0x00ffffff-no-rj",
      category: "Kids",
      description: "Cartoon Network is an American cable television channel owned by Warner Bros. Discovery.",
      currentShow: {
        title: "Adventure Time",
        time: "2:00 PM - 3:00 PM",
        description: "Adventures of Finn and Jake in the Land of Ooo.",
        genre: "Animation",
      },
      upcomingShows: [
        {
          title: "Regular Show",
          time: "3:00 PM - 4:00 PM",
          description: "Mordecai and Rigby's workplace adventures.",
          genre: "Animation",
        },
      ],
      isLive: true,
      viewers: "450K",
    },
    {
      id: 10,
      title: "Comedy Central",
      platform: "Live TV",
      imageUrl: "https://1000logos.net/wp-content/uploads/2021/05/Comedy-Central-logo.png",
      category: "Entertainment",
      description: "Comedy Central is an American basic cable television channel owned by Paramount Global.",
      currentShow: {
        title: "The Daily Show",
        time: "2:00 PM - 3:00 PM",
        description: "Late-night comedy and news satire.",
        genre: "Comedy",
      },
      upcomingShows: [
        {
          title: "South Park",
          time: "3:00 PM - 4:00 PM",
          description: "Animated comedy series about four boys.",
          genre: "Comedy",
        },
      ],
      isLive: true,
      viewers: "720K",
    },
    {
      id: 11,
      title: "History Channel",
      platform: "Live TV",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/History_%282021%29.svg/250px-History_%282021%29.svg.png",
      category: "Documentary",
      description: "History is an American pay television network and flagship channel owned by A&E Networks.",
      currentShow: {
        title: "Ancient Aliens",
        time: "2:00 PM - 3:00 PM",
        description: "Explore theories about extraterrestrial influence on human history.",
        genre: "Documentary",
      },
      upcomingShows: [
        {
          title: "The Curse of Oak Island",
          time: "3:00 PM - 4:00 PM",
          description: "Treasure hunting on Oak Island.",
          genre: "Documentary",
        },
      ],
      isLive: true,
      viewers: "580K",
    },
    {
      id: 12,
      title: "Food Network",
      platform: "Live TV",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Food_Network_logo.svg/1200px-Food_Network_logo.svg.png",
      category: "Lifestyle",
      description: "Food Network is an American basic cable channel owned by Warner Bros. Discovery.",
      currentShow: {
        title: "Chopped",
        time: "2:00 PM - 3:00 PM",
        description: "Chefs compete with mystery ingredients.",
        genre: "Cooking",
      },
      upcomingShows: [
        {
          title: "Guy's Grocery Games",
          time: "3:00 PM - 4:00 PM",
          description: "Cooking competition in a grocery store.",
          genre: "Cooking",
        },
      ],
      isLive: true,
      viewers: "340K",
    },
    {
      id: 13,
      title: "TLC",
      platform: "Live TV",
      imageUrl: "https://cdn.freebiesupply.com/logos/thumbs/2x/tlc-10-logo.png",
      category: "Lifestyle",
      description: "TLC is an American pay television channel owned by Warner Bros. Discovery.",
      currentShow: {
        title: "90 Day Fiancé",
        time: "2:00 PM - 3:00 PM",
        description: "Couples navigate the K-1 visa process.",
        genre: "Reality",
      },
      upcomingShows: [
        {
          title: "Say Yes to the Dress",
          time: "3:00 PM - 4:00 PM",
          description: "Brides find their perfect wedding dress.",
          genre: "Reality",
        },
      ],
      isLive: true,
      viewers: "420K",
    },
    {
      id: 14,
      title: "Animal Planet",
      platform: "Live TV",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/2018_Animal_Planet_logo.svg/2560px-2018_Animal_Planet_logo.svg.png",
      category: "Documentary",
      description: "Animal Planet is an American multinational pay television channel owned by Warner Bros. Discovery.",
      currentShow: {
        title: "The Zoo",
        time: "2:00 PM - 3:00 PM",
        description: "Behind-the-scenes look at zoo operations.",
        genre: "Documentary",
      },
      upcomingShows: [
        {
          title: "River Monsters",
          time: "3:00 PM - 4:00 PM",
          description: "Extreme angler investigates aquatic mysteries.",
          genre: "Documentary",
        },
      ],
      isLive: true,
      viewers: "380K",
    },
    {
      id: 15,
      title: "FX",
      platform: "Live TV",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4d/FX_International_logo.svg",
      category: "Entertainment",
      description: "FX is an American pay television channel owned by FX Networks, LLC.",
      currentShow: {
        title: "American Horror Story Marathon",
        time: "2:00 PM - 5:00 PM",
        description: "Horror anthology series marathon.",
        genre: "Horror",
      },
      upcomingShows: [
        {
          title: "The Walking Dead",
          time: "5:00 PM - 6:00 PM",
          description: "Post-apocalyptic survival drama.",
          genre: "Drama",
        },
      ],
      isLive: true,
      viewers: "1.3M",
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
    setSelectedChannel(channel);
    setShowLiveTvInfo(true);
  };

  const handleLiveTvInfoBackPress = () => {
    setShowLiveTvInfo(false);
    setSelectedChannel(null);
  };

  if (showLiveTvInfo && selectedChannel) {
    return <LiveTvInfoPage onBackPress={handleLiveTvInfoBackPress} channelData={selectedChannel} />;
  }

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
