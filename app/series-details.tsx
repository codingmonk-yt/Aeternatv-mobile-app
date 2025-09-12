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
import SeriesInfoPage from './series-info';

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
  const [showSeriesInfo, setShowSeriesInfo] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<any>(null);

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
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BYWI3ODJlMzktY2U5NC00ZjdlLWE1MGItNWQxZDk3NWNjN2RhXkEyXkFqcGc@._V1_.jpg',
      seasons: [
        {
          seasonNumber: 1,
          seasonName: "Season 1",
          episodes: [
            {
              id: 1,
              title: "When You're Lost in the Darkness",
              episodeNumber: "E01",
              duration: "81 m",
              thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BZjBiOGIyY2YtOTA3OC00YzY1LThkYjktMGRkYTNhNTExY2I2XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg",
            },
            {
              id: 2,
              title: "Infected",
              episodeNumber: "E02",
              duration: "50 m",
              thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BZjBiOGIyY2YtOTA3OC00YzY1LThkYjktMGRkYTNhNTExY2I2XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg",
            },
            {
              id: 3,
              title: "Long, Long Time",
              episodeNumber: "E03",
              duration: "75 m",
              thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BZjBiOGIyY2YtOTA3OC00YzY1LThkYjktMGRkYTNhNTExY2I2XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg",
            },
            {
              id: 4,
              title: "Please Hold to My Hand",
              episodeNumber: "E04",
              duration: "45 m",
              thumbnailUrl: "https://m.media-amazon.com/images/M/MV5BZjBiOGIyY2YtOTA3OC00YzY1LThkYjktMGRkYTNhNTExY2I2XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg",
            },
          ],
        },
      ],
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
    
    // Hardcoded Breaking Bad data for now - will be replaced with API calls later
    const breakingBadData = {
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
        },
        {
          air_date: "2025-08-14",
          episode_count: "13",
          name: "Temporada 2",
          overview: "",
          season_number: "2",
          cover: "",
          cover_big: "",
          vote_average: 0
        },
        {
          air_date: "2025-08-14",
          episode_count: "13",
          name: "Temporada 3",
          overview: "",
          season_number: "3",
          cover: "",
          cover_big: "",
          vote_average: 0
        },
        {
          air_date: "2025-08-14",
          episode_count: "13",
          name: "Temporada 4",
          overview: "",
          season_number: "4",
          cover: "",
          cover_big: "",
          vote_average: 0
        },
        {
          air_date: "2025-08-14",
          episode_count: "16",
          name: "Temporada 5",
          overview: "",
          season_number: "5",
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
        "1": [
          {
            id: "881475",
            episode_num: "1",
            title: "Breaking Bad: A Química do Mal [L] (2008) S01 E01",
            container_extension: "mp4",
            info: {
              releasedate: "",
              plot: "Um professor de química do ensino médio começa a vender drogas para sustentar sua família.",
              duration_secs: 3501,
              duration: "00:58:21",
              movie_image: "http://timg.bdta.pro/t/p/w600_and_h900_bestv2/ydlY3iPfeOAvu8gVqrxPoMvzNCn.jpg",
              bitrate: 0,
              rating: 8.083,
              season: "01",
              tmdb_id: "",
              cover_big: "http://timg.bdta.pro/t/p/w600_and_h900_bestv2/ydlY3iPfeOAvu8gVqrxPoMvzNCn.jpg"
            },
            subtitles: [],
            custom_sid: "",
            added: "1736505754",
            season: 1,
            direct_source: ""
          },
          {
            id: "881476",
            episode_num: "2",
            title: "Breaking Bad: A Química do Mal [L] (2008) S01 E02",
            container_extension: "mp4",
            info: {
              releasedate: "",
              plot: "O saldo da primeira transação fracassada de Walt e Jesse é de dois cadáveres e sua desova. Skyler suspeita que seu marido esteja tramando algo.",
              duration_secs: 2903,
              duration: "00:48:23",
              movie_image: "http://timg.bdta.pro/t/p/w600_and_h900_bestv2/tjDNvbokPLtEnpFyFPyXMOd6Zr1.jpg",
              bitrate: 0,
              rating: 8.102,
              season: "01",
              tmdb_id: "",
              cover_big: "http://timg.bdta.pro/t/p/w600_and_h900_bestv2/tjDNvbokPLtEnpFyFPyXMOd6Zr1.jpg"
            },
            subtitles: [],
            custom_sid: "",
            added: "1736505754",
            season: 1,
            direct_source: ""
          },
          {
            id: "881477",
            episode_num: "3",
            title: "Breaking Bad: A Química do Mal [L] (2008) S01 E03",
            container_extension: "mp4",
            info: {
              releasedate: "",
              plot: "Enquanto Walt limpa a bagunça que foi deixada após a primeira venda de drogas, ele pensa em contar a Skyler o segredo sobre a sua doença.",
              duration_secs: 2903,
              duration: "00:48:23",
              movie_image: "http://timg.bdta.pro/t/p/w600_and_h900_bestv2/2kBeBlxGqBOdWlKwzAxiwkfU5on.jpg",
              bitrate: 0,
              rating: 8.158,
              season: "01",
              tmdb_id: "",
              cover_big: "http://timg.bdta.pro/t/p/w600_and_h900_bestv2/2kBeBlxGqBOdWlKwzAxiwkfU5on.jpg"
            },
            subtitles: [],
            custom_sid: "",
            added: "1736505754",
            season: 1,
            direct_source: ""
          },
          {
            id: "881478",
            episode_num: "4",
            title: "Breaking Bad: A Química do Mal [L] (2008) S01 E04",
            container_extension: "mp4",
            info: {
              releasedate: "",
              plot: "Forçado a revelar a verdade sobre sua doença, Walt enfrenta o dilema de pagar pelos caros tratamentos de câncer.",
              duration_secs: 2905,
              duration: "00:48:25",
              movie_image: "http://timg.bdta.pro/t/p/w600_and_h900_bestv2/i5BAJVhuIWfkoSqDID6FnQNCTVc.jpg",
              bitrate: 0,
              rating: 7.828,
              season: "01",
              tmdb_id: "",
              cover_big: "http://timg.bdta.pro/t/p/w600_and_h900_bestv2/i5BAJVhuIWfkoSqDID6FnQNCTVc.jpg"
            },
            subtitles: [],
            custom_sid: "",
            added: "1736505754",
            season: 1,
            direct_source: ""
          },
          {
            id: "881479",
            episode_num: "5",
            title: "Breaking Bad: A Química do Mal [L] (2008) S01 E05",
            container_extension: "mp4",
            info: {
              releasedate: "",
              plot: "Skyler organiza uma intervenção para persuadir Walt a aceitar a generosa oferta de seu antigo parceiro de pesquisa de pagar pelo seu tratamento de câncer.",
              duration_secs: 2889,
              duration: "00:48:09",
              movie_image: "http://timg.bdta.pro/t/p/w600_and_h900_bestv2/82G3wZgEvZLKcte6yoZJahUWBtx.jpg",
              bitrate: 0,
              rating: 8.144,
              season: "01",
              tmdb_id: "",
              cover_big: "http://timg.bdta.pro/t/p/w600_and_h900_bestv2/82G3wZgEvZLKcte6yoZJahUWBtx.jpg"
            },
            subtitles: [],
            custom_sid: "",
            added: "1736505754",
            season: 1,
            direct_source: ""
          },
          {
            id: "881480",
            episode_num: "6",
            title: "Breaking Bad: A Química do Mal [L] (2008) S01 E06",
            container_extension: "mp4",
            info: {
              releasedate: "",
              plot: "Conforme os efeitos colaterais e os custos do seu tratamento aumentam rapidamente, Walt exige que Jesse encontre um grande comprador para suas drogas, deixando Jesse encrencado com um perigoso ex-presidiário.",
              duration_secs: 2897,
              duration: "00:48:17",
              movie_image: "http://timg.bdta.pro/t/p/w600_and_h900_bestv2/hyYwqbmcHn3fuxWE3h4IhZZbkU3.jpg",
              bitrate: 0,
              rating: 8.879,
              season: "01",
              tmdb_id: "",
              cover_big: "http://timg.bdta.pro/t/p/w600_and_h900_bestv2/hyYwqbmcHn3fuxWE3h4IhZZbkU3.jpg"
            },
            subtitles: [],
            custom_sid: "",
            added: "1736505754",
            season: 1,
            direct_source: ""
          },
          {
            id: "881481",
            episode_num: "7",
            title: "Breaking Bad: A Química do Mal [L] (2008) S01 E07",
            container_extension: "mp4",
            info: {
              releasedate: "",
              plot: "Após Jesse escapar da morte, Walt concorda em produzir mais drogas para Tuco, enquanto Skyler suspeita que sua irmã roubou um presente de chá de bebê.",
              duration_secs: 2873,
              duration: "00:47:53",
              movie_image: "http://timg.bdta.pro/t/p/w600_and_h900_bestv2/1dgFAsajUpUT7DLXgAxHb9GyXHH.jpg",
              bitrate: 0,
              rating: 8.374,
              season: "01",
              tmdb_id: "",
              cover_big: "http://timg.bdta.pro/t/p/w600_and_h900_bestv2/1dgFAsajUpUT7DLXgAxHb9GyXHH.jpg"
            },
            subtitles: [],
            custom_sid: "",
            added: "1736505754",
            season: 1,
            direct_source: ""
          }
        ],
        "2": [
          {
            id: "881482",
            episode_num: "1",
            title: "Breaking Bad: A Química do Mal [L] (2008) S02 E01",
            container_extension: "mp4",
            info: {
              releasedate: "",
              plot: "Enquanto planejam sua última grande venda, Walt e Jesse temem que Tuco esteja pensando em matá-los assim que a entrega for feita.",
              duration_secs: 2845,
              duration: "00:47:25",
              movie_image: "http://timg.bdta.pro/t/p/w600_and_h900_bestv2/7vVujNqjP23MtPqUTBNITIW3DDA.jpg",
              bitrate: 0,
              rating: 8.326,
              season: "02",
              tmdb_id: "",
              cover_big: "http://timg.bdta.pro/t/p/w600_and_h900_bestv2/7vVujNqjP23MtPqUTBNITIW3DDA.jpg"
            },
            subtitles: [],
            custom_sid: "",
            added: "1736505755",
            season: 2,
            direct_source: ""
          }
        ]
      }
    };
    
    setSelectedSeries(breakingBadData);
    setShowSeriesInfo(true);
  };

  const handleSeriesInfoBackPress = () => {
    setShowSeriesInfo(false);
    setSelectedSeries(null);
  };

  if (showSeriesInfo && selectedSeries) {
    return <SeriesInfoPage onBackPress={handleSeriesInfoBackPress} seriesData={selectedSeries} />;
  }

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
