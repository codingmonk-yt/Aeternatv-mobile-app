import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import LiveTvSection from '../components/LiveTvSection';
import SeriesSection from '../components/SeriesSection';
import { ErrorScreenWrapper } from '../src/components/common/ErrorScreens';
import { withErrorHandling } from '../src/components/common/withErrorHandling';
import HeroCarousel from '../src/components/HeroCarousel';
import SectionComponent from '../src/components/SectionComponent';
import { useLiveTvSections } from '../src/hooks/useLiveTvSections';
import { useRetry } from '../src/hooks/useRetry';
import { useSections } from '../src/hooks/useSections';
import { useSeriesSections } from '../src/hooks/useSeriesSections';
import { FeaturedContent } from '../src/types';
import { getResponsiveSpacing, responsiveStyles } from '../src/utils/responsive';
import LiveTvInfoPage from './live-tv-info';
import MovieInfoPage from './movie-info';
import SeriesInfoPage from './series-info';


interface HomePageProps {
  onToggleBottomNav?: (hide: boolean) => void;
  onVideoPlayerOpen?: (title?: string, videoUrl?: string) => void;
}

function HomePage({ onToggleBottomNav, onVideoPlayerOpen }: HomePageProps) {
  const router = useRouter();
  const [selectedMovie, setSelectedMovie] = useState<FeaturedContent | null>(null);
  const [showMovieInfo, setShowMovieInfo] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<any>(null);
  const [showSeriesInfo, setShowSeriesInfo] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [showLiveTvInfo, setShowLiveTvInfo] = useState(false);

  // Fetch sections from API
  const { sections, isLoading: sectionsLoading, error: sectionsError, refetch: refetchSections } = useSections();
  
  // Fetch series sections from API
  const { data: seriesSectionsData, isLoading: seriesSectionsLoading, error: seriesSectionsError, refetch: refetchSeriesSections } = useSeriesSections();
  
  // Fetch Live TV sections from API
  const { data: liveTvSectionsData, isLoading: liveTvSectionsLoading, error: liveTvSectionsError, refetch: refetchLiveTvSections } = useLiveTvSections();
  
  // Retry mechanism
  const { retry: retrySections, isRetrying } = useRetry({
    maxRetries: 3,
    onRetry: (attempt) => console.log(`Retrying sections fetch, attempt ${attempt}`),
  });

  const { retry: retrySeriesSections, isRetrying: isRetryingSeries } = useRetry({
    maxRetries: 3,
    onRetry: (attempt) => console.log(`Retrying series sections fetch, attempt ${attempt}`),
  });

  const { retry: retryLiveTvSections, isRetrying: isRetryingLiveTv } = useRetry({
    maxRetries: 3,
    onRetry: (attempt) => console.log(`Retrying Live TV sections fetch, attempt ${attempt}`),
  });

  const handleMoviePress = (movie: FeaturedContent) => {
    console.log('Movie pressed:', movie.title);
    setSelectedMovie(movie);
    // You can add navigation to movie details here
  };

  const handlePlayPress = (movie: FeaturedContent) => {
    console.log('Play pressed:', movie.title);
    setSelectedMovie(movie);
    setShowMovieInfo(true);
  };

  const handleMoreInfoPress = (movie: FeaturedContent) => {
    console.log('More Info pressed for movie ID:', movie.id);
    setSelectedMovie(movie);
    setShowMovieInfo(true);
  };

  const handleMovieInfoBackPress = () => {
    setShowMovieInfo(false);
    setSelectedMovie(null);
  };

  const handleRetry = async () => {
    try {
      await retrySections(() => refetchSections());
      await retrySeriesSections(() => refetchSeriesSections());
      await retryLiveTvSections(() => refetchLiveTvSections());
    } catch (error) {
      console.error('Retry failed:', error);
    }
  };

  const handleSectionMoviePress = (movie: any) => {
    console.log('Section movie pressed:', movie.title || movie.name);
    console.log('Movie ID:', movie._id);
    setSelectedMovie({
      id: movie._id,
      title: movie.title || movie.name,
      subtitle: movie.year && movie.year !== '0' ? movie.year : undefined,
      description: '',
      genre: '',
      year: parseInt(movie.year) || 0,
      rating: movie.rating || 0,
      image: movie.stream_icon,
      type: 'Movie' as const,
    });
    setShowMovieInfo(true);
  };

  const handleSeriesPress = (series: any) => {
    console.log('Series pressed:', series.title || series.name);
    console.log('Series ID:', series._id);
    setSelectedSeries(series);
    setShowSeriesInfo(true);
  };

  const handleSeriesInfoBackPress = () => {
    setShowSeriesInfo(false);
    setSelectedSeries(null);
  };

  const handleChannelPress = (channel: any) => {
    console.log('Channel pressed:', channel.name);
    console.log('Channel stream_id:', channel.stream_id);
    setSelectedChannel(channel);
    setShowLiveTvInfo(true);
  };

  const handleLiveTvInfoBackPress = () => {
    setShowLiveTvInfo(false);
    setSelectedChannel(null);
  };

  // Show movie info page if selected
  if (showMovieInfo && selectedMovie) {
    return <MovieInfoPage onBackPress={handleMovieInfoBackPress} movieId={selectedMovie.id} onVideoPlayerOpen={onVideoPlayerOpen} />;
  }

  // Show series info page if selected
  if (showSeriesInfo && selectedSeries) {
    return <SeriesInfoPage onBackPress={handleSeriesInfoBackPress} seriesId={selectedSeries._id} onVideoPlayerOpen={onVideoPlayerOpen} />;
  }

  // Show Live TV info page if selected
  if (showLiveTvInfo && selectedChannel) {
    return <LiveTvInfoPage onBackPress={handleLiveTvInfoBackPress} channelData={selectedChannel} streamId={selectedChannel.stream_id} onVideoPlayerOpen={onVideoPlayerOpen} />;
  }

  // Check if any API call has failed
  const hasError = sectionsError || seriesSectionsError || liveTvSectionsError;
  const isLoading = sectionsLoading || seriesSectionsLoading || liveTvSectionsLoading;

  return (
    <ErrorScreenWrapper
      error={hasError}
      isLoading={isLoading}
      onRetry={handleRetry}
      serverErrorMessage="Failed to load content. Please check your connection and try again."
      offlineMessage="You're offline. Please check your internet connection to view content."
    >
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Carousel Section - Now uses API data */}
          <HeroCarousel
            onMoviePress={handleMoviePress}
            onPlayPress={handlePlayPress}
            onMoreInfoPress={handleMoreInfoPress}
          />
          
          {/* Dynamic Sections from API */}
          {sectionsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#420000" />
              <Text style={styles.loadingText}>Loading sections...</Text>
            </View>
          ) : sections.length > 0 ? (
            sections
              .filter(section => section.active && section.categoryMovies.length > 0)
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((section) => (
                <SectionComponent
                  key={section._id}
                  section={section}
                  onMoviePress={handleSectionMoviePress}
                />
              ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No sections available</Text>
            </View>
          )}

          {/* Series Sections */}
          {seriesSectionsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#420000" />
              <Text style={styles.loadingText}>Loading series sections...</Text>
            </View>
          ) : seriesSectionsData?.data && seriesSectionsData.data.length > 0 ? (
            seriesSectionsData.data
              .filter(section => section.active && section.categorySeries.length > 0)
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((section) => {
                // Flatten all series from all categories in this section
                const allSeries = section.categorySeries.flatMap(category => category.series);
                return (
                  <SeriesSection
                    key={section._id}
                    title={section.title}
                    series={allSeries}
                    onSeriesPress={handleSeriesPress}
                  />
                );
              })
          ) : null}

          {/* Live TV Sections */}
          {liveTvSectionsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#420000" />
              <Text style={styles.loadingText}>Loading Live TV sections...</Text>
            </View>
          ) : liveTvSectionsData?.data && liveTvSectionsData.data.length > 0 ? (
            liveTvSectionsData.data
              .filter(section => section.active && section.categoryMovies.length > 0)
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((section) => {
                // Flatten all channels from all categories in this section
                const allChannels = section.categoryMovies.flatMap(category => category.movies);
                return (
                  <LiveTvSection
                    key={section._id}
                    title={section.title}
                    channels={allChannels}
                    onChannelPress={handleChannelPress}
                  />
                );
              })
          ) : null}
          
          {/* Bottom padding to prevent overlap with bottom navigation */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
    </ErrorScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Reduced extra space for bottom navigation
  },
  bottomPadding: {
    height: 40, // Additional padding at the bottom
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: responsiveStyles.caption.fontSize,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
    marginTop: getResponsiveSpacing(16),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: responsiveStyles.caption.fontSize,
    color: '#FF6B6B',
    fontStyle: 'italic',
    marginBottom: getResponsiveSpacing(16),
  },
  retryButton: {
    backgroundColor: '#420000',
    paddingHorizontal: getResponsiveSpacing(20),
    paddingVertical: getResponsiveSpacing(10),
    borderRadius: getResponsiveSpacing(8),
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  retryButtonDisabled: {
    opacity: 0.6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: responsiveStyles.body.fontSize,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
});

// Export with error handling
export default withErrorHandling(HomePage);
