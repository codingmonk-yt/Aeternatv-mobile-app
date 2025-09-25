import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold, Roboto_900Black, useFonts } from '@expo-google-fonts/roboto';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavigation from '../components/BottomNavigation';
import SplashScreen from '../src/components/SplashScreen';
import { useAndroidBackButton } from '../src/hooks/useAndroidBackButton';
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
  
  // Navigation stack to track screen history
  const [navigationStack, setNavigationStack] = useState<string[]>(['home']);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleVideoPlayerOpen = (title?: string, videoUrl?: string) => {
    setVideoPlayerTitle(title || 'Now Playing');
    setVideoPlayerUrl(videoUrl || '');
    setShowVideoPlayer(true);
    setHideBottomNav(true);
    // Add video player to navigation stack
    setNavigationStack(prev => [...prev, 'video-player']);
  };

  const handleVideoPlayerClose = () => {
    setShowVideoPlayer(false);
    setHideBottomNav(false);
    // Remove video player from navigation stack
    setNavigationStack(prev => prev.filter(screen => screen !== 'video-player'));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Add to navigation stack if it's a new screen
    setNavigationStack(prev => {
      if (prev[prev.length - 1] !== tab) {
        return [...prev, tab];
      }
      return prev;
    });
  };

  // Android back button handling
  const handleAndroidBackPress = () => {
    // If video player is open, close it first
    if (showVideoPlayer) {
      handleVideoPlayerClose();
      return true; // Handled
    }

    // If we have more than one screen in the stack, go back
    if (navigationStack.length > 1) {
      const newStack = [...navigationStack];
      newStack.pop(); // Remove current screen
      const previousScreen = newStack[newStack.length - 1];
      
      setNavigationStack(newStack);
      setActiveTab(previousScreen);
      setHideBottomNav(false);
      return true; // Handled
    }

    // If we're on the home screen, show exit confirmation
    if (activeTab === 'home') {
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Exit',
            onPress: () => {
              // This will trigger the default Android back behavior (exit app)
              return false;
            },
          },
        ]
      );
      return true; // Handled (showed dialog)
    }

    // Default behavior for other cases
    return false;
  };

  // Use the Android back button hook
  useAndroidBackButton({
    onBackPress: handleAndroidBackPress,
    enabled: !showSplash, // Disable during splash screen
  });

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
          {!hideBottomNav && <BottomNavigation activeTab={activeTab} onTabPress={handleTabChange} />}
        </SafeAreaView>
      </View>
    </ReduxProvider>
  );
}