import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

interface SeriesInfoPageProps {
  onBackPress?: () => void;
  seriesData?: {
    seasons: Array<{
      air_date: string;
      episode_count: string;
      name: string;
      overview: string;
      season_number: string;
      cover: string;
      cover_big: string;
      vote_average: number;
    }>;
    info: {
      name: string;
      title: string;
      year: string;
      cover: string;
      plot: string;
      cast: string;
      director: string;
      genre: string;
      release_date: string;
      releaseDate: string;
      last_modified: string;
      rating: string;
      rating_5based: number;
      backdrop_path: string[];
      youtube_trailer: string;
      episode_run_time: string;
      category_id: string;
      category_ids: number[];
    };
    episodes: {
      [seasonNumber: string]: Array<{
        id: string;
        episode_num: string;
        title: string;
        container_extension: string;
        info: {
          releasedate: string;
          plot: string;
          duration_secs: number;
          duration: string;
          movie_image: string;
          bitrate: number;
          rating: number;
          season: string;
          tmdb_id: string;
          cover_big: string;
        };
        subtitles: any[];
        custom_sid: string;
        added: string;
        season: number;
        direct_source: string;
      }>;
    };
  };
}

export default function SeriesInfoPage({
  onBackPress,
  seriesData,
}: SeriesInfoPageProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedSeason, setSelectedSeason] = useState("1");
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);

  // Use provided series data or default data
  const series = seriesData || {
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
    info: {
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
      category_ids: [169]
    },
    episodes: {
      "1": []
    }
  };

  // Get current season data
  const currentSeason = series.seasons?.find(s => s.season_number === selectedSeason) || series.seasons?.[0];
  const currentEpisodes = series.episodes?.[selectedSeason] || [];

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleEpisodePress = (episode: any) => {
    console.log("Episode pressed:", episode.title);
    // TODO: Navigate to video player
  };

  return (
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
              source={{ uri: series.info?.backdrop_path?.[0] || series.info?.cover }}
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
              onPress={() => setShowSeasonDropdown(!showSeasonDropdown)}
            >
              <Text style={styles.seasonText}>{currentSeason?.name || `Season ${selectedSeason}`}</Text>
              <Text style={styles.chevronIcon}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Series Title and Rating */}
          <View style={styles.titleSection}>
            <Text style={styles.seriesTitle}>{series.info?.title || series.info?.name}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={styles.ratingText}>{series.info?.rating}</Text>
              <Text style={styles.yearText}>{series.info?.year}</Text>
            </View>
          </View>
        </View>

        {/* Season Dropdown */}
        {showSeasonDropdown && (
          <View style={styles.seasonDropdown}>
            {series.seasons?.map((season) => (
              <TouchableOpacity
                key={season.season_number}
                style={styles.seasonOption}
                onPress={() => {
                  setSelectedSeason(season.season_number);
                  setShowSeasonDropdown(false);
                }}
              >
                <Text style={styles.seasonOptionText}>{season.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Episodes List Section */}
        <View style={styles.episodesContainer}>
          {currentEpisodes.map((episode, index) => (
            <TouchableOpacity
              key={episode.id}
              style={styles.episodeCard}
              onPress={() => handleEpisodePress(episode)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: episode.info?.movie_image || episode.info?.cover_big }}
                style={styles.episodeThumbnail}
              />
              <View style={styles.episodeInfo}>
                <Text style={styles.episodeTitle}>{episode.title}</Text>
                <Text style={styles.episodeDetails}>
                  E{episode.episode_num} · {episode.info?.duration}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      </View>
    </TouchableWithoutFeedback>
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
});
