import { LinearGradient } from "expo-linear-gradient";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface SearchResult {
  id: number;
  title: string;
  type: "Movie" | "Series" | "Live TV";
  year: string;
  rating: string;
  imageUrl: string;
  category?: string;
}

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
  result: SearchResult;
  onPress: () => void;
  isSelected?: boolean;
}

function SearchResultItem({ result, onPress, isSelected }: SearchResultItemProps) {
  return (
    <TouchableOpacity
      style={[styles.resultItem, isSelected && styles.selectedResultItem]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: result.imageUrl }} style={styles.resultThumbnail} />
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle}>{result.title}</Text>
        <Text style={styles.resultMetadata}>
          {result.type} · {result.year} · IMDB {result.rating}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function SearchPage() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"Movies" | "Series" | "Live TV">("Movies");
  const [selectedResult, setSelectedResult] = useState<number | null>(null);

  // Mock search data - Movies from movies-details.tsx
  const mockSearchResults: SearchResult[] = [
    {
      id: 1,
      title: "Severance",
      type: "Movie",
      year: "2022",
      rating: "8.7",
      imageUrl: "https://snworksceo.imgix.net/ttd/df199939-19cc-41c1-a949-a86557ec949f.sized-1000x1000.png?w=1000&dpr=2",
    },
    {
      id: 2,
      title: "The Last of Us",
      type: "Movie",
      year: "2023",
      rating: "8.9",
      imageUrl: "https://m.media-amazon.com/images/M/MV5BYWI3ODJlMzktY2U5NC00ZjdlLWE1MGItNWQxZDk3NWNjN2RhXkEyXkFqcGc@._V1_.jpg",
    },
    {
      id: 3,
      title: "You",
      type: "Movie",
      year: "2018",
      rating: "8.1",
      imageUrl: "https://m.media-amazon.com/images/M/MV5BODA0NDA1MzgtYmIyYS00NmYwLTlhZDYtMjczMTU1M2ZkYzdkXkEyXkFqcGc@._V1_.jpg",
    },
    {
      id: 4,
      title: "The Handmaid's Tale",
      type: "Movie",
      year: "2017",
      rating: "8.4",
      imageUrl: "https://images.justwatch.com/poster/331049749/s718/season-6.jpg",
    },
    {
      id: 5,
      title: "Adolescence",
      type: "Movie",
      year: "2024",
      rating: "6.8",
      imageUrl: "https://m.media-amazon.com/images/M/MV5BNGY1YjBiNzMtYWZhNC00OWViLWE0MzItNjc4YzczOGNiM2I0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    },
    {
      id: 6,
      title: "The Gorge",
      type: "Movie",
      year: "2025",
      rating: "7.2",
      imageUrl: "https://m.media-amazon.com/images/S/pv-target-images/aab0322a11698c77fe0dc30131b2ffdba59a73d3544a0b25cf5cb7d20e029f84.jpg",
    },
    {
      id: 7,
      title: "The Signal",
      type: "Movie",
      year: "2024",
      rating: "7.5",
      imageUrl: "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p26674282_b_v13_aa.jpg",
    },
    {
      id: 8,
      title: "Nautilus",
      type: "Movie",
      year: "2024",
      rating: "6.9",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/a/a6/Nautilus_%282024%29_poster.jpg",
    },
    {
      id: 9,
      title: "Mobland",
      type: "Movie",
      year: "2024",
      rating: "7.1",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/d/dc/MobLand.jpg",
    },
    {
      id: 10,
      title: "Dune: Part Two",
      type: "Movie",
      year: "2024",
      rating: "8.6",
      imageUrl: "https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    },
    {
      id: 11,
      title: "Oppenheimer",
      type: "Movie",
      year: "2023",
      rating: "8.8",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Oppenheimer_%28film%29.jpg/250px-Oppenheimer_%28film%29.jpg",
    },
    {
      id: 12,
      title: "Barbie",
      type: "Movie",
      year: "2023",
      rating: "7.0",
      imageUrl: "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p13472534_p_v8_am.jpg",
    },
    {
      id: 13,
      title: "Spider-Man: Across the Spider-Verse",
      type: "Movie",
      year: "2023",
      rating: "8.7",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Spider-Man-_Across_the_Spider-Verse_poster.jpg/250px-Spider-Man-_Across_the_Spider-Verse_poster.jpg",
    },
    {
      id: 14,
      title: "Guardians of the Galaxy Vol. 3",
      type: "Movie",
      year: "2023",
      rating: "8.2",
      imageUrl: "https://resizing.flixster.com/xV7EqckHQwE9I284oqcs3OAwqHc=/fit-in/705x460/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p17845781_v_v13_ar.jpg",
    },
    {
      id: 15,
      title: "Fast X",
      type: "Movie",
      year: "2023",
      rating: "6.2",
      imageUrl: "https://image.tmdb.org/t/p/original/pAe4mqaHI7wOS7vz4btYAiX4UVN.jpg",
    },
  ];

  // Mock search data - Series from series-details.tsx
  const mockSeriesResults: SearchResult[] = [
    {
      id: 16,
      title: "Stranger Things",
      type: "Series",
      year: "2016",
      rating: "8.7",
      imageUrl: "https://resizing.flixster.com/cs-44B-LN4TMp-5wnSXitM99U7M=/ems.cHJkLWVtcy1hc3NldHMvdHZzZWFzb24vYTM4ZDFlYzctZmUxMS00ZGY1LTg1NGItMGNmNGNjOGNkZDJhLmpwZw==",
    },
    {
      id: 17,
      title: "The Crown",
      type: "Series",
      year: "2016",
      rating: "8.6",
      imageUrl: "https://m.media-amazon.com/images/M/MV5BODcyODZlZDMtZGE0Ni00NjBhLWJlYTAtZDdlNWY3MzkwMGVhXkEyXkFqcGc@._V1_.jpg",
    },
    {
      id: 18,
      title: "House of the Dragon",
      type: "Series",
      year: "2022",
      rating: "8.5",
      imageUrl: "https://m.media-amazon.com/images/M/MV5BZjBiOGIyY2YtOTA3OC00YzY1LThkYjktMGRkYTNhNTExY2I2XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg",
    },
    {
      id: 19,
      title: "The Mandalorian",
      type: "Series",
      year: "2019",
      rating: "8.8",
      imageUrl: "https://m.media-amazon.com/images/I/91904DC-yXL._UF1000,1000_QL80_.jpg",
    },
    {
      id: 20,
      title: "Euphoria",
      type: "Series",
      year: "2019",
      rating: "8.4",
      imageUrl: "https://m.media-amazon.com/images/M/MV5BZjVlN2M2N2MtOWViZC00MzIxLTlhZWEtMTIwNDIwMzE3ZWJiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    },
    {
      id: 21,
      title: "Wednesday",
      type: "Series",
      year: "2022",
      rating: "8.1",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg2zQFi39dG64omzMOcEpSaPotn8YO3NlmUw&s",
    },
    {
      id: 22,
      title: "The Boys",
      type: "Series",
      year: "2019",
      rating: "8.7",
      imageUrl: "https://m.media-amazon.com/images/M/MV5BMWJlN2U5MzItNjU4My00NTM2LWFjOWUtOWFiNjg3ZTMxZDY1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    },
    {
      id: 23,
      title: "Bridgerton",
      type: "Series",
      year: "2020",
      rating: "7.4",
      imageUrl: "https://resizing.flixster.com/Zdvk-xZ3cN7uIJGvqPcuAijAb1U=/ems.cHJkLWVtcy1hc3NldHMvdHZzZXJpZXMvOWQyNzdiMGEtZmZhYi00YmZjLTkxZDktNDFlMjFhNjZkZmYwLmpwZw==",
    },
    {
      id: 24,
      title: "The Witcher",
      type: "Series",
      year: "2019",
      rating: "8.2",
      imageUrl: "https://m.media-amazon.com/images/M/MV5BMTQ5MDU5MTktMDZkMy00NDU1LWIxM2UtODg5OGFiNmRhNDBjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    },
    {
      id: 25,
      title: "Loki",
      type: "Series",
      year: "2021",
      rating: "8.2",
      imageUrl: "https://m.media-amazon.com/images/I/81xETRmcFwL._UF1000,1000_QL80_.jpg",
    },
    {
      id: 26,
      title: "Ozark",
      type: "Series",
      year: "2017",
      rating: "8.5",
      imageUrl: "https://resizing.flixster.com/3ko6zO6791p1QPOXHUI2eCwmHXQ=/ems.cHJkLWVtcy1hc3NldHMvdHZzZXJpZXMvMDIyOTBmN2QtMzM0Yi00ODUxLWE0MWYtMmViYWJiOGViZjRkLmpwZw==",
    },
    {
      id: 27,
      title: "Squid Game",
      type: "Series",
      year: "2021",
      rating: "8.1",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/38/Squid_Game_season_2_poster.png",
    },
    {
      id: 28,
      title: "The Bear",
      type: "Series",
      year: "2022",
      rating: "8.6",
      imageUrl: "https://m.media-amazon.com/images/M/MV5BYWZhNDZiMzAtZmZlYS00MWFmLWE2MWEtNDAxZTZiN2U4Y2U2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    },
    {
      id: 29,
      title: "Yellowstone",
      type: "Series",
      year: "2018",
      rating: "8.7",
      imageUrl: "https://resizing.flixster.com/cS0gOaiC8j_lzBVbLZqtCz0S9uo=/fit-in/705x460/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p16780458_b_v13_ab.jpg",
    },
  ];

  // Mock search data - Live TV from live-tv-details.tsx
  const mockLiveTvResults: SearchResult[] = [
    {
      id: 30,
      title: "CNN",
      type: "Live TV",
      year: "2024",
      rating: "Live",
      imageUrl: "https://download.logo.wine/logo/CNN/CNN-Logo.wine.png",
    },
    {
      id: 31,
      title: "ESPN",
      type: "Live TV",
      year: "2024",
      rating: "Live",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/60/ESPN_logos.png",
    },
    {
      id: 32,
      title: "BBC News",
      type: "Live TV",
      year: "2024",
      rating: "Live",
      imageUrl: "https://download.logo.wine/logo/BBC/BBC-Logo.wine.png",
    },
    {
      id: 33,
      title: "Discovery",
      type: "Live TV",
      year: "2024",
      rating: "Live",
      imageUrl: "https://logos-world.net/wp-content/uploads/2022/01/Discovery-Channel-Logo.png",
    },
    {
      id: 34,
      title: "MTV",
      type: "Live TV",
      year: "2024",
      rating: "Live",
      imageUrl: "https://cdn.freebiesupply.com/images/large/2x/mtv-logo-png-transparent.png",
    },
    {
      id: 35,
      title: "National Geographic",
      type: "Live TV",
      year: "2024",
      rating: "Live",
      imageUrl: "https://logos-world.net/wp-content/uploads/2020/09/National-Geographic-Logo.png",
    },
    {
      id: 36,
      title: "HBO",
      type: "Live TV",
      year: "2024",
      rating: "Live",
      imageUrl: "https://logos-world.net/wp-content/uploads/2020/09/HBO-Emblem.png",
    },
    {
      id: 37,
      title: "Fox News",
      type: "Live TV",
      year: "2024",
      rating: "Live",
      imageUrl: "https://www.hatchwise.com/wp-content/uploads/2023/08/Fox-News-Channel-Emblem-1024x576.png",
    },
    {
      id: 38,
      title: "Cartoon Network",
      type: "Live TV",
      year: "2024",
      rating: "Live",
      imageUrl: "https://yt3.googleusercontent.com/1Cqc3xwwMDAp_tZlbXRL4u8bKLzprzS-oGluxBS_hH-BUCVBAi9f-XsVceF2bWrf15UYIf_-rg=s900-c-k-c0x00ffffff-no-rj",
    },
    {
      id: 39,
      title: "Comedy Central",
      type: "Live TV",
      year: "2024",
      rating: "Live",
      imageUrl: "https://1000logos.net/wp-content/uploads/2021/05/Comedy-Central-logo.png",
    },
    {
      id: 40,
      title: "History Channel",
      type: "Live TV",
      year: "2024",
      rating: "Live",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/History_%282021%29.svg/250px-History_%282021%29.svg.png",
    },
    {
      id: 41,
      title: "Food Network",
      type: "Live TV",
      year: "2024",
      rating: "Live",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Food_Network_logo.svg/1200px-Food_Network_logo.svg.png",
    },
    {
      id: 42,
      title: "TLC",
      type: "Live TV",
      year: "2024",
      rating: "Live",
      imageUrl: "https://cdn.freebiesupply.com/logos/thumbs/2x/tlc-10-logo.png",
    },
    {
      id: 43,
      title: "Animal Planet",
      type: "Live TV",
      year: "2024",
      rating: "Live",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/2018_Animal_Planet_logo.svg/2560px-2018_Animal_Planet_logo.svg.png",
    },
    {
      id: 44,
      title: "FX",
      type: "Live TV",
      year: "2024",
      rating: "Live",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4d/FX_International_logo.svg",
    },
  ];

  // Filter results based on active tab
  const getFilteredResults = () => {
    const allResults = [...mockSearchResults, ...mockSeriesResults, ...mockLiveTvResults];
    return allResults.filter(result => {
      const matchesQuery = searchQuery === "" || result.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = result.type === activeTab || (activeTab === "Live TV" && result.type === "Live TV");
      return matchesQuery && matchesTab;
    });
  };

  const handleResultPress = (result: SearchResult) => {
    setSelectedResult(result.id);
    console.log("Result pressed:", result.title);
    // TODO: Navigate to appropriate detail page
  };

  const filteredResults = getFilteredResults();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(0, 0, 0, 1)", "rgb(26, 15, 67)", "rgb(37, 28, 87)", "rgb(22, 8, 75)", "#000000"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.2, 0.5, 0.8, 1]}
        style={styles.gradientBackground}
      >
        {/* Search Bar */}
        <View style={[styles.searchContainer, { paddingTop: insets.top }]}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search movies, series, channels..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
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
        <ScrollView
          style={styles.resultsContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsContent}
        >
          {filteredResults.map((result) => (
            <SearchResultItem
              key={result.id}
              result={result}
              onPress={() => handleResultPress(result)}
              isSelected={selectedResult === result.id}
            />
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
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
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
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
    fontWeight: "500",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  activeTab: {
    backgroundColor: "rgba(162, 89, 255, 0.2)",
    borderColor: "rgba(162, 89, 255, 0.3)",
  },
  tabText: {
    fontSize: 14,
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
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  resultItem: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  selectedResultItem: {
    backgroundColor: "rgba(162, 89, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(162, 89, 255, 0.2)",
  },
  resultThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#2a2a2a",
    marginRight: 16,
  },
  resultContent: {
    flex: 1,
    justifyContent: "center",
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  resultMetadata: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
  },
});