import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 3; // 3 columns with margins

interface SeriesCardProps {
  title: string;
  platform: string;
  imageUrl: string;
  onPress: () => void;
}

function SeriesCard({ title, platform, imageUrl, onPress }: SeriesCardProps) {
  return (
    <TouchableOpacity style={styles.seriesCard} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: imageUrl }} style={styles.seriesImage} />
      <View style={styles.seriesOverlay}>
        <Text style={styles.seriesTitle}>{title}</Text>
        <Text style={styles.seriesPlatform}>{platform}</Text>
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

interface SeriesDetailsPageProps {
  onBackPress?: () => void;
}

export default function SeriesDetailsPage({ onBackPress }: SeriesDetailsPageProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('New');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['New', 'Sci-Fi', 'Comedy', 'Romance', 'Thriller', 'Action', 'Adventure', 'Animation', 'Biography', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Sport', 'War', 'Western'];

  const series = [
    {
      id: 1,
      title: 'Stranger Things',
      platform: 'Netflix',
      imageUrl: 'https://resizing.flixster.com/cs-44B-LN4TMp-5wnSXitM99U7M=/ems.cHJkLWVtcy1hc3NldHMvdHZzZWFzb24vYTM4ZDFlYzctZmUxMS00ZGY1LTg1NGItMGNmNGNjOGNkZDJhLmpwZw=='
    },
    {
      id: 2,
      title: 'The Crown',
      platform: 'Netflix',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BODcyODZlZDMtZGE0Ni00NjBhLWJlYTAtZDdlNWY3MzkwMGVhXkEyXkFqcGc@._V1_.jpg'
    },
    {
      id: 3,
      title: 'House of the Dragon',
      platform: 'HBO Max',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BZjBiOGIyY2YtOTA3OC00YzY1LThkYjktMGRkYTNhNTExY2I2XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg'
    },
    {
      id: 4,
      title: 'The Mandalorian',
      platform: 'Disney+',
      imageUrl: 'https://m.media-amazon.com/images/I/91904DC-yXL._UF1000,1000_QL80_.jpg'
    },
    {
      id: 5,
      title: 'Euphoria',
      platform: 'HBO Max',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BZjVlN2M2N2MtOWViZC00MzIxLTlhZWEtMTIwNDIwMzE3ZWJiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
    },
    {
      id: 6,
      title: 'Wednesday',
      platform: 'Netflix',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg2zQFi39dG64omzMOcEpSaPotn8YO3NlmUw&s'
    },
    {
      id: 7,
      title: 'The Boys',
      platform: 'Prime Video',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BMWJlN2U5MzItNjU4My00NTM2LWFjOWUtOWFiNjg3ZTMxZDY1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
    },
    {
      id: 8,
      title: 'Bridgerton',
      platform: 'Netflix',
      imageUrl: 'https://resizing.flixster.com/Zdvk-xZ3cN7uIJGvqPcuAijAb1U=/ems.cHJkLWVtcy1hc3NldHMvdHZzZXJpZXMvOWQyNzdiMGEtZmZhYi00YmZjLTkxZDktNDFlMjFhNjZkZmYwLmpwZw=='
    },
    {
      id: 9,
      title: 'The Witcher',
      platform: 'Netflix',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BMTQ5MDU5MTktMDZkMy00NDU1LWIxM2UtODg5OGFiNmRhNDBjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
    },
    {
      id: 10,
      title: 'Loki',
      platform: 'Disney+',
      imageUrl: 'https://m.media-amazon.com/images/I/81xETRmcFwL._UF1000,1000_QL80_.jpg'
    },
    {
      id: 11,
      title: 'Ozark',
      platform: 'Netflix',
      imageUrl: 'https://resizing.flixster.com/3ko6zO6791p1QPOXHUI2eCwmHXQ=/ems.cHJkLWVtcy1hc3NldHMvdHZzZXJpZXMvMDIyOTBmN2QtMzM0Yi00ODUxLWE0MWYtMmViYWJiOGViZjRkLmpwZw=='
    },
    {
      id: 12,
      title: 'The Last of Us',
      platform: 'HBO Max',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BYWI3ODJlMzktY2U5NC00ZjdlLWE1MGItNWQxZDk3NWNjN2RhXkEyXkFqcGc@._V1_.jpg'
    },
    {
      id: 13,
      title: 'Squid Game',
      platform: 'Netflix',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/3/38/Squid_Game_season_2_poster.png'
    },
    {
      id: 14,
      title: 'The Bear',
      platform: 'Hulu',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BYWZhNDZiMzAtZmZlYS00MWFmLWE2MWEtNDAxZTZiN2U4Y2U2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
    },
    {
      id: 15,
      title: 'Yellowstone',
      platform: 'Paramount+',
      imageUrl: 'https://resizing.flixster.com/cS0gOaiC8j_lzBVbLZqtCz0S9uo=/fit-in/705x460/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p16780458_b_v13_ab.jpg'
    }
  ];

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleSeriesPress = (series: any) => {
    console.log('Series pressed:', series.title);
    // TODO: Navigate to series details
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#110546', '#0B033A', '#110546', '#000000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.4, 0.6, 0.7, 1]}
        style={styles.gradientBackground}
      >
        {/* Sticky Header */}
        <View style={styles.stickyHeader}>
          {/* Header with back button and title */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Series</Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Artists, Films, Tv shows ..."
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

        {/* Scrollable Series Grid */}
        <ScrollView 
          style={styles.scrollableContent} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
        >
          <View style={styles.seriesGrid}>
            {series.map((seriesItem) => (
              <SeriesCard
                key={seriesItem.id}
                title={seriesItem.title}
                platform={seriesItem.platform}
                imageUrl={seriesItem.imageUrl}
                onPress={() => handleSeriesPress(seriesItem)}
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    backdropFilter: 'blur(10px)',
  },
  scrollableContent: {
    flex: 1,
    marginTop: 200,
  },
  scrollContentContainer: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 12,
  },
  activeChip: {
    backgroundColor: '#A259FF',
  },
  chipText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  activeChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  seriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingTop: 30,
  },
  seriesCard: {
    width: cardWidth,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  seriesImage: {
    width: '100%',
    height: cardWidth * 1.5,
    backgroundColor: '#2a2a2a',
  },
  seriesOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
  },
  seriesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  seriesPlatform: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
