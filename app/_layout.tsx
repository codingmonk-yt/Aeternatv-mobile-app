import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold, Roboto_900Black, useFonts } from '@expo-google-fonts/roboto';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavigation from '../components/BottomNavigation';
import SplashScreen from '../src/components/SplashScreen';
import { useOrientationLock } from '../src/hooks/useOrientationLock';
import { ReduxProvider } from '../src/providers/ReduxProvider';
import HomePage from './home';
import MoviesPage from './movies';
import SearchPage from './search';
import VideoPlayerPage from './video-player';
import WishlistPage from './wishlist';

export default function RootLayout() {
  // Load Google Fonts - Roboto only
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    Roboto_900Black,
  });

  // Lock orientation to portrait for all screens except video player
  useOrientationLock();

  const [activeTab, setActiveTab] = useState('home');
  const [hideBottomNav, setHideBottomNav] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [videoPlayerTitle, setVideoPlayerTitle] = useState<string>('');
  const [videoPlayerUrl, setVideoPlayerUrl] = useState<string>('');

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleVideoPlayerOpen = (title?: string, videoUrl?: string) => {
    setVideoPlayerTitle(title || 'Now Playing');
    setVideoPlayerUrl(videoUrl || '');
    setShowVideoPlayer(true);
    setHideBottomNav(true);
  };

  const handleVideoPlayerClose = () => {
    setShowVideoPlayer(false);
    setHideBottomNav(false);
    setVideoPlayerUrl('');
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onVideoPlayerOpen={handleVideoPlayerOpen} />;
      case 'movies':
        return <MoviesPage onVideoPlayerOpen={handleVideoPlayerOpen} />;
      case 'search':
        return <SearchPage onVideoPlayerOpen={handleVideoPlayerOpen} />;
      case 'wishlist':
        return <WishlistPage onToggleBottomNav={setHideBottomNav} onVideoPlayerOpen={handleVideoPlayerOpen} />;
      default:
        return <HomePage onVideoPlayerOpen={handleVideoPlayerOpen} />;
    }
  };

  // Show loading screen while fonts are loading
  if (!fontsLoaded) {
    return (
      <ReduxProvider>
        <StatusBar style="light" />
        <View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </ReduxProvider>
    );
  }

  // Show splash screen first
  if (showSplash) {
    return (
      <ReduxProvider>
        <StatusBar style="light" />
        <SplashScreen onAnimationFinish={handleSplashFinish} duration={3000} />
      </ReduxProvider>
    );
  }

  // Show video player if active
  if (showVideoPlayer) {
    return (
      <ReduxProvider>
        <StatusBar style="light" />
        <VideoPlayerPage 
          onBackPress={handleVideoPlayerClose} 
          title={videoPlayerTitle}
          videoUrl={videoPlayerUrl}
        />
      </ReduxProvider>
    );
  }

  return (
    <ReduxProvider>
      <StatusBar style="light" />
      {/* Purple background extends into status bar area */}
      <View style={{ flex: 1, backgroundColor: '#6B46C1' }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
          <View style={{ flex: 1 }}>
            {renderPage()}
          </View>
          {!hideBottomNav && <BottomNavigation activeTab={activeTab} onTabPress={setActiveTab} />}
        </SafeAreaView>
      </View>
    </ReduxProvider>
  );
}