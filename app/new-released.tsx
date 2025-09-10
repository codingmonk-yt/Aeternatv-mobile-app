import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MovieCard, { MovieItem } from '../components/MovieCard';

// Mock data for new released movies
const newReleasedMovies: MovieItem[] = [
  {
    id: 1,
    title: 'The Electric State',
    subtitle: 'You',
    platform: 'NETFLIX',
    releaseDate: 'MARCH 14',
    image: 'https://images.pexels.com/photos/1200450/pexels-photo-1200450.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 2,
    title: 'Adolescence',
    platform: 'NETFLIX',
    releaseDate: 'MARCH 15',
    image: 'https://images.pexels.com/photos/3945317/pexels-photo-3945317.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 3,
    title: 'Wolf Man',
    subtitle: 'Severance',
    platform: 'IMAX',
    releaseDate: 'JANUARY 17',
    image: 'https://images.pexels.com/photos/1200450/pexels-photo-1200450.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 4,
    title: 'You',
    platform: 'NETFLIX',
    releaseDate: 'FEBRUARY 9',
    image: 'https://images.pexels.com/photos/3945317/pexels-photo-3945317.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 5,
    title: 'G20',
    subtitle: 'Adolescence',
    platform: 'PRIME VIDEO',
    releaseDate: 'APRIL 19',
    image: 'https://images.pexels.com/photos/1200450/pexels-photo-1200450.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 6,
    title: 'Severance',
    platform: 'APPLE TV+',
    releaseDate: 'FEBRUARY 17',
    image: 'https://images.pexels.com/photos/3945317/pexels-photo-3945317.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 7,
    title: 'The Revolution Is Here',
    platform: 'HBO MAX',
    releaseDate: 'MARCH 20',
    image: 'https://images.pexels.com/photos/1200450/pexels-photo-1200450.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 8,
    title: 'The Last of Us',
    platform: 'HBO MAX',
    releaseDate: 'JANUARY 15',
    image: 'https://images.pexels.com/photos/3945317/pexels-photo-3945317.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

const filterChips = ['Gener', 'Lable 2025', 'Rate', 'For you'];
const sortOptions = ['Rates', 'Top trending', 'Companies'];

export default function NewReleasedPage({ 
  onBack, 
  pageType = 'new-released' 
}: { 
  onBack?: () => void;
  pageType?: 'new-released' | 'recently-watched';
}) {
  const [selectedFilter, setSelectedFilter] = useState(1); // Default to "Lable 2025"
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedSort, setSelectedSort] = useState(0); // Default to "Rates"

  const handleCardPress = (item: MovieItem) => {
    console.log('Card pressed:', item.title);
  };

  const handleBackPress = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleFilterPress = (index: number) => {
    setSelectedFilter(index);
  };

  const handleFilterButtonPress = () => {
    setShowFilterModal(!showFilterModal);
  };

  const handleSortSelect = (index: number) => {
    setSelectedSort(index);
    setShowFilterModal(false);
  };

  const renderMovieCard = ({ item }: { item: MovieItem }) => (
    <View style={styles.cardContainer}>
      <MovieCard
        item={item}
        onPress={handleCardPress}
        variant="grid"
      />
      <View style={styles.cardInfo}>
        <Text style={styles.movieTitle}>{item.title}</Text>
        <Text style={styles.movieYear}>2025</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#1A1A1A', 'rgba(13, 13, 13, 0.2)']}
          style={styles.backButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <TouchableOpacity style={styles.buttonContent} onPress={handleBackPress}>
            <Image 
              source={require('../assets/icons/chevron-left.png')} 
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </LinearGradient>
        <Text style={[
          styles.headerTitle,
          pageType === 'recently-watched' && styles.centeredTitle
        ]}>
          {pageType === 'recently-watched' ? 'Recently watched' : 'New released'}
        </Text>
        {pageType === 'new-released' ? (
          <LinearGradient
            colors={['#1A1A1A', 'rgba(13, 13, 13, 0.2)']}
            style={styles.filterButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <TouchableOpacity style={styles.buttonContent} onPress={handleFilterButtonPress}>
              <Image 
                source={require('../assets/icons/filter-lines.png')} 
                style={styles.filterIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          <View style={styles.placeholderButton} />
        )}
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterChips.map((filter, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.filterChip,
                selectedFilter === index && styles.activeFilterChip
              ]}
              onPress={() => handleFilterPress(index)}
            >
              <Text style={[
                styles.filterChipText,
                selectedFilter === index && styles.activeFilterChipText
              ]}>
                {filter}
              </Text>
              {selectedFilter === index && (
                <Text style={styles.removeIcon}>×</Text>
              )}
              {selectedFilter !== index && (
                <Text style={styles.arrowIcon}>▼</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Movie Grid */}
      <FlatList
        data={newReleasedMovies}
        renderItem={renderMovieCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Modal */}
      {showFilterModal && (
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <LinearGradient
            colors={['#1A1A1A', 'rgba(13, 13, 13, 0.2)']}
            style={styles.modalContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <TouchableOpacity 
              style={styles.modalContent}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <Text style={styles.modalTitle}>Sort by</Text>
              {sortOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalOption}
                  onPress={() => handleSortSelect(index)}
                >
                  <Text style={styles.modalOptionText}>{option}</Text>
                  <View style={[
                    styles.radioButton,
                    selectedSort === index && styles.radioButtonSelected
                  ]}>
                    {selectedSort === index && <View style={styles.radioButtonInner} />}
                  </View>
                </TouchableOpacity>
              ))}
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    opacity: 1,
  },
  buttonContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#ffffff',
  },
  headerTitle: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  centeredTitle: {
    textAlign: 'center',
    flex: 1,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    opacity: 1,
  },
  filterIcon: {
    width: 24,
    height: 24,
    tintColor: '#ffffff',
  },
  placeholderButton: {
    width: 40,
    height: 40,
  },
  filterContainer: {
    paddingBottom: 20,
  },
  filterScroll: {
    paddingHorizontal: 20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  activeFilterChip: {
    backgroundColor: '#A259FF',
    borderColor: '#A259FF',
  },
  filterChipText: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#888888',
    marginRight: 4,
  },
  activeFilterChipText: {
    color: '#ffffff',
  },
  removeIcon: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 4,
  },
  arrowIcon: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#888888',
    marginLeft: 4,
  },
  gridContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: '48%',
    marginBottom: 20,
  },
  cardInfo: {
    marginTop: 8,
  },
  movieTitle: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  movieYear: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#888888',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  modalContainer: {
    position: 'absolute',
    width: 158,
    height: 166,
    top: 121,
    left: 190,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    opacity: 1,
  },
  modalContent: {
    flex: 1,
    padding: 16,
    paddingTop: 12,
    justifyContent: 'flex-start',
  },
  modalTitle: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    color: '#888888',
    marginBottom: 15,
    textAlign: 'left',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  modalOptionText: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#A259FF',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#A259FF',
  },
});
