import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LiveTvDetailsPage from './live-tv-details';
import MoviesDetailsPage from './movies-details';
import SeriesDetailsPage from './series-details';

const { width, height } = Dimensions.get('window');

interface CategoryCardProps {
  title: string;
  subtitle: string;
  icon: string;
  onPress: () => void;
}

function CategoryCard({ title, subtitle, icon, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity 
      style={styles.cardContainer} 
      onPress={onPress} 
      activeOpacity={0.8}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <BlurView intensity={20} tint="dark" style={styles.card}>
        <TouchableOpacity 
          style={styles.cardContent}
          onPress={onPress}
          activeOpacity={1}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>{title}</Text>
            {/* <Text style={styles.cardSubtitle}>{subtitle}</Text> */}
          </View>
          <View style={styles.arrowContainer}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
      </BlurView>
    </TouchableOpacity>
  );
}

export default function MoviesPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState('main');

  const handleCategoryPress = (category: string) => {
    console.log(`Category pressed: ${category}`);
    if (category === 'Movies') {
      console.log('Showing movies details...');
      setCurrentPage('movies');
    } else if (category === 'Series') {
      console.log('Showing series details...');
      setCurrentPage('series');
    } else if (category === 'LiveTV') {
      console.log('Showing live TV details...');
      setCurrentPage('live-tv');
    } else {
      console.log(`Pressed ${category}`);
    }
  };

  const handleBackPress = () => {
    setCurrentPage('main');
  };

  if (currentPage === 'movies') {
    return <MoviesDetailsPage onBackPress={handleBackPress} />;
  }

  if (currentPage === 'series') {
    return <SeriesDetailsPage onBackPress={handleBackPress} />;
  }

  if (currentPage === 'live-tv') {
    return <LiveTvDetailsPage onBackPress={handleBackPress} />;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(0, 0, 0, 1)", "rgb(26, 15, 67)", "rgb(37, 28, 87)", "rgb(22, 8, 75)", "#000000"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.4, 0.6, 0.7, 1]}
        style={styles.gradientBackground}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Browse Content</Text>
          </View>
          
          <View style={styles.cardsContainer}>
            <CategoryCard
              title="Movies"
              subtitle="Latest blockbusters and classics"
              icon="🎬"
              onPress={() => handleCategoryPress('Movies')}
            />
            
            <CategoryCard
              title="Series"
              subtitle="Binge-worthy shows and series"
              icon="📺"
              onPress={() => handleCategoryPress('Series')}
            />
            
            <CategoryCard
              title="Live TV"
              subtitle="Live channels and events"
              icon="📡"
              onPress={() => handleCategoryPress('LiveTV')}
            />
          </View>
        </View>
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
  content: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 32,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'left',
    letterSpacing: -1,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: 24,
    paddingTop: 20,
  },
  cardContainer: {
    marginHorizontal: 0,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 40,
    minHeight: 140,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 28,
  },
  icon: {
    fontSize: 36,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  cardSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: 24,
    fontWeight: '400',
  },
  arrowContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '300',
  },
});
