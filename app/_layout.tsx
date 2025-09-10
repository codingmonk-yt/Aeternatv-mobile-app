import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavigation from '../components/BottomNavigation';
import HomePage from './index';
import MoviesPage from './movies';
import SearchPage from './search';
import WishlistPage from './wishlist';

export default function RootLayout() {
  const [activeTab, setActiveTab] = useState('home');

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'movies':
        return <MoviesPage />;
      case 'search':
        return <SearchPage />;
      case 'wishlist':
        return <WishlistPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <>
      <StatusBar style="light" backgroundColor="#000000" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
        <View style={{ flex: 1 }}>
          {renderPage()}
        </View>
        <BottomNavigation activeTab={activeTab} onTabPress={setActiveTab} />
      </SafeAreaView>
    </>
  );
}
