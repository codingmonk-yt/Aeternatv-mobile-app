import { LinearGradient } from 'expo-linear-gradient';
import { Home, Play, Search } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getResponsiveIconSize, getResponsivePadding, getResponsiveSpacing } from '../src/utils/responsive';

interface BottomNavigationProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export default function BottomNavigation({ activeTab, onTabPress }: BottomNavigationProps) {
  const insets = useSafeAreaInsets();
  
  const tabs = [
    { id: 'home', Icon: Home },
    { id: 'movies', Icon: Play },
    { id: 'search', Icon: Search },
    // { id: 'wishlist', Icon: Bookmark },
  ];

  return (
    <View style={[styles.container, { bottom: insets.bottom }]}>
      {/* Inner shadow overlay */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.05)', 'transparent', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.innerShadow}
      />
      
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const IconComponent = tab.Icon;
        
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabPress(tab.id)}
            style={isActive ? styles.activeTabButton : styles.inactiveTabButton}
          >
            {isActive ? (
              <LinearGradient
                colors={['#420000', "#3C0000", '#420000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.activeGradient}
              >
                <IconComponent
                  size={getResponsiveIconSize(24)}
                  color="#ffffff"
                />
              </LinearGradient>
            ) : (
              <IconComponent
                size={getResponsiveIconSize(22)}
                color="#8E8E93"
                opacity={0.8}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: getResponsiveSpacing(16),
    right: getResponsiveSpacing(16),
    backgroundColor: 'rgba(28, 28, 30, 1)', // Full opacity
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 72,
    borderRadius: getResponsiveSpacing(24), // All 4 corners rounded
    // Subtle border
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)', // Very thin white border
    // Shadow for depth with brand color
    shadowColor: '#222222',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 20,
  },
  innerShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: getResponsiveSpacing(24),
    pointerEvents: 'none',
  },
  activeTabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: getResponsiveIconSize(56),
    height: getResponsiveIconSize(56),
    borderRadius: getResponsiveSpacing(18),
    backgroundColor: 'transparent',
  },
  inactiveTabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: getResponsiveIconSize(48),
    height: getResponsiveIconSize(48),
    borderRadius: getResponsiveSpacing(16),
    backgroundColor: 'transparent',
  },
  activeGradient: {
    width: getResponsiveIconSize(56),
    height: getResponsiveIconSize(56),
    borderRadius: getResponsiveSpacing(18),
    alignItems: 'center',
    justifyContent: 'center',
    // Enhanced glow effect
    shadowColor: '#420000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    // Android shadow
    elevation: 8,
  },
});
