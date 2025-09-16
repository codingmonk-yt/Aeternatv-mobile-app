import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronRight, Film, Play, Radio, Tv } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ErrorScreenWrapper } from '../src/components/common/ErrorScreens';
import { withErrorHandling } from '../src/components/common/withErrorHandling';
import { Fonts } from '../src/utils/fonts';
import { getResponsiveIconSize, getResponsivePadding, getResponsiveSpacing, responsiveStyles } from '../src/utils/responsive';
import LiveTvDetailsPage from './live-tv-details';
import MoviesDetailsPage from './movies-details';
import SeriesDetailsPage from './series-details';

const { width, height } = Dimensions.get('window');

interface CategoryCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: readonly [string, string, ...string[]];
  onPress: () => void;
}

function CategoryCard({ title, subtitle, icon, gradient, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity 
      style={styles.cardContainer} 
      onPress={onPress} 
      activeOpacity={0.9}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
          <View style={styles.cardContent}>
            {/* <View style={styles.iconContainer}>
              {icon}
            </View> */}
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardSubtitle}>{subtitle}</Text>
            </View>
            <View style={styles.arrowContainer}>
              <ChevronRight size={getResponsiveIconSize(28)} color="#ffffff" />
            </View>
          </View>
        </BlurView>
      </LinearGradient>
    </TouchableOpacity>
  );
}

interface MoviesPageProps {
  onVideoPlayerOpen?: (title?: string) => void;
}

function MoviesPage({ onVideoPlayerOpen }: MoviesPageProps) {
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
    return <MoviesDetailsPage onBackPress={handleBackPress} onVideoPlayerOpen={onVideoPlayerOpen} />;
  }

  if (currentPage === 'series') {
    return <SeriesDetailsPage onBackPress={handleBackPress} onVideoPlayerOpen={onVideoPlayerOpen} />;
  }

  if (currentPage === 'live-tv') {
    return <LiveTvDetailsPage onBackPress={handleBackPress} onVideoPlayerOpen={onVideoPlayerOpen} />;
  }

  return (
    <ErrorScreenWrapper
      error={false}
      isLoading={false}
      onRetry={() => {}}
      serverErrorMessage="Failed to load content. Please check your connection and try again."
      offlineMessage="You're offline. Please check your internet connection to view content."
    >
      <View style={styles.container}>
        <LinearGradient
          colors={["#0a0a0a", "#1a0a0a", "#2a0a0a", "#1a0a0a", "#0a0a0a"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Discover Entertainment</Text>
                <Text style={styles.headerSubtitle}>Choose your preferred content type</Text>
              </View>
              
              <View style={styles.cardsContainer}>
                <CategoryCard
                  title="Movies"
                  subtitle="Latest blockbusters and timeless classics"
                  icon={<Film size={getResponsiveIconSize(28)} color="#ffffff" />}
                  gradient={["#ff6b6b", "#ee5a52", "#ff4757"] as const}
                  onPress={() => handleCategoryPress('Movies')}
                />
                
                <CategoryCard
                  title="Series"
                  subtitle="Binge-worthy shows and epic series"
                  icon={<Tv size={getResponsiveIconSize(28)} color="#ffffff" />}
                  gradient={["#4ecdc4", "#44a08d", "#2c3e50"] as const}
                  onPress={() => handleCategoryPress('Series')}
                />
                
                <CategoryCard
                  title="Live TV"
                  subtitle="Live channels and real-time events"
                  icon={<Radio size={getResponsiveIconSize(28)} color="#ffffff" />}
                  gradient={["#a8edea", "#fed6e3", "#d299c2"] as const}
                  onPress={() => handleCategoryPress('LiveTV')}
                />
              </View>

              <View style={styles.featuresContainer}>
                <Text style={styles.featuresTitle}>Why Choose AeternaTV?</Text>
                <View style={styles.featuresGrid}>
                  <View style={styles.featureItem}>
                    <View style={styles.featureIcon}>
                      <Play size={getResponsiveIconSize(20)} color="#ff6b6b" />
                    </View>
                    <Text style={styles.featureText}>High Quality</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <View style={styles.featureIcon}>
                      <Tv size={getResponsiveIconSize(20)} color="#4ecdc4" />
                    </View>
                    <Text style={styles.featureText}>Live Streaming</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <View style={styles.featureIcon}>
                      <Film size={getResponsiveIconSize(20)} color="#a8edea" />
                    </View>
                    <Text style={styles.featureText}>Vast Library</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    </ErrorScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: getResponsiveSpacing(40),
  },
  content: {
    flex: 1,
    paddingTop: getResponsiveSpacing(60),
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsiveSpacing(40),
  },
  header: {
    marginBottom: getResponsiveSpacing(40),
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: responsiveStyles.title.fontSize * 1.5,
    fontFamily: Fonts.black,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -1,
    marginBottom: getResponsiveSpacing(8),
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  headerSubtitle: {
    fontSize: responsiveStyles.body.fontSize,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  cardsContainer: {
    marginBottom: getResponsiveSpacing(50),
    gap: getResponsiveSpacing(20),
  },
  cardContainer: {
    marginHorizontal: 0,
  },
  cardGradient: {
    borderRadius: getResponsiveSpacing(20),
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  cardBlur: {
    borderRadius: getResponsiveSpacing(20),
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: getResponsivePadding(24),
    minHeight: 120,
  },
  iconContainer: {
    width: getResponsiveIconSize(70),
    height: getResponsiveIconSize(70),
    borderRadius: getResponsiveSpacing(20),
    // backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getResponsiveSpacing(20),
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: responsiveStyles.title.fontSize,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: getResponsiveSpacing(6),
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  cardSubtitle: {
    fontSize: responsiveStyles.caption.fontSize,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    fontWeight: '400',
  },
  arrowContainer: {
    // width: getResponsiveIconSize(45),
    // height: getResponsiveIconSize(45),
    // borderRadius: getResponsiveIconSize(22.5),
    // // backgroundColor: 'rgba(255, 255, 255, 0.15)',
    // justifyContent: 'center',
    // alignItems: 'center',
    // shadowColor: '#000000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    // elevation: 2,
  },
  featuresContainer: {
    marginTop: getResponsiveSpacing(20),
    paddingBottom: getResponsiveSpacing(100), // Added padding to prevent overlap with bottom nav
  },
  featuresTitle: {
    fontSize: responsiveStyles.subtitle.fontSize,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: getResponsiveSpacing(24),
    letterSpacing: -0.3,
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: getResponsivePadding(10),
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: getResponsiveIconSize(50),
    height: getResponsiveIconSize(50),
    borderRadius: getResponsiveIconSize(25),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: getResponsiveSpacing(8),
  },
  featureText: {
    fontSize: responsiveStyles.small.fontSize,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
  },
});

// Export with error handling
export default withErrorHandling(MoviesPage);
