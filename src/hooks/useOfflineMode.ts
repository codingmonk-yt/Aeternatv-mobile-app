import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useNetworkStatus } from './useNetworkStatus';

interface CachedContent {
  id: string;
  title: string;
  type: 'Movie' | 'Series' | 'Live TV';
  image: string;
  timestamp: number;
}

const CACHE_KEYS = {
  RECENTLY_VIEWED: 'recently_viewed',
  WISHLIST: 'wishlist',
  DOWNLOADS: 'downloads',
};

export const useOfflineMode = () => {
  const { isOnline } = useNetworkStatus();
  const [cachedContent, setCachedContent] = useState<CachedContent[]>([]);
  const [isOfflineMode, setIsOfflineMode] = useState(!isOnline);

  useEffect(() => {
    setIsOfflineMode(!isOnline);
  }, [isOnline]);

  useEffect(() => {
    if (isOfflineMode) {
      loadCachedContent();
    }
  }, [isOfflineMode]);

  const loadCachedContent = async () => {
    try {
      const [recentlyViewed, wishlist, downloads] = await Promise.all([
        AsyncStorage.getItem(CACHE_KEYS.RECENTLY_VIEWED),
        AsyncStorage.getItem(CACHE_KEYS.WISHLIST),
        AsyncStorage.getItem(CACHE_KEYS.DOWNLOADS),
      ]);

      const allCachedContent: CachedContent[] = [
        ...(recentlyViewed ? JSON.parse(recentlyViewed) : []),
        ...(wishlist ? JSON.parse(wishlist) : []),
        ...(downloads ? JSON.parse(downloads) : []),
      ];

      // Remove duplicates and sort by timestamp
      const uniqueContent = allCachedContent
        .filter((content, index, self) => 
          index === self.findIndex(c => c.id === content.id)
        )
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 20); // Limit to 20 items

      setCachedContent(uniqueContent);
    } catch (error) {
      console.error('Error loading cached content:', error);
      setCachedContent([]);
    }
  };

  const addToRecentlyViewed = async (content: Omit<CachedContent, 'timestamp'>) => {
    try {
      const recentlyViewed = await AsyncStorage.getItem(CACHE_KEYS.RECENTLY_VIEWED);
      const items: CachedContent[] = recentlyViewed ? JSON.parse(recentlyViewed) : [];
      
      // Remove if already exists
      const filteredItems = items.filter(item => item.id !== content.id);
      
      // Add new item with timestamp
      const newItem: CachedContent = {
        ...content,
        timestamp: Date.now(),
      };
      
      const updatedItems = [newItem, ...filteredItems].slice(0, 50); // Keep only 50 items
      
      await AsyncStorage.setItem(CACHE_KEYS.RECENTLY_VIEWED, JSON.stringify(updatedItems));
      
      if (isOfflineMode) {
        loadCachedContent();
      }
    } catch (error) {
      console.error('Error adding to recently viewed:', error);
    }
  };

  const addToWishlist = async (content: Omit<CachedContent, 'timestamp'>) => {
    try {
      const wishlist = await AsyncStorage.getItem(CACHE_KEYS.WISHLIST);
      const items: CachedContent[] = wishlist ? JSON.parse(wishlist) : [];
      
      // Check if already in wishlist
      const exists = items.some(item => item.id === content.id);
      if (exists) return;
      
      const newItem: CachedContent = {
        ...content,
        timestamp: Date.now(),
      };
      
      const updatedItems = [...items, newItem];
      await AsyncStorage.setItem(CACHE_KEYS.WISHLIST, JSON.stringify(updatedItems));
      
      if (isOfflineMode) {
        loadCachedContent();
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeFromWishlist = async (contentId: string) => {
    try {
      const wishlist = await AsyncStorage.getItem(CACHE_KEYS.WISHLIST);
      const items: CachedContent[] = wishlist ? JSON.parse(wishlist) : [];
      
      const updatedItems = items.filter(item => item.id !== contentId);
      await AsyncStorage.setItem(CACHE_KEYS.WISHLIST, JSON.stringify(updatedItems));
      
      if (isOfflineMode) {
        loadCachedContent();
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  return {
    isOfflineMode,
    cachedContent,
    addToRecentlyViewed,
    addToWishlist,
    removeFromWishlist,
    loadCachedContent,
  };
};


