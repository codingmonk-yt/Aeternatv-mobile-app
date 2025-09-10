import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

interface BottomNavigationProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export default function BottomNavigation({ activeTab, onTabPress }: BottomNavigationProps) {
  const tabs = [
    { id: 'home', iconSource: require('../assets/icons/home.png')},
    { id: 'movies', iconSource: require('../assets/icons/play.png')},
    { id: 'search', iconSource: require('../assets/icons/search-md.png')},
    { id: 'wishlist', iconSource: require('../assets/icons/bookmark.png')},
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabPress(tab.id)}
            style={isActive ? styles.activeTabButton : styles.inactiveTabButton}
          >
            {isActive ? (
              <LinearGradient
                colors={['#A259FF', '#562199']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.activeGradient}
              >
                <Image
                  source={tab.iconSource}
                  style={styles.activeIcon}
                  resizeMode="contain"
                />
              </LinearGradient>
            ) : (
              <Image
                source={tab.iconSource}
                style={styles.inactiveIcon}
                resizeMode="contain"
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
    bottom: 0,
    left: 16,
    right: 16,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333333',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 8,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 16,
  },
  activeTabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  inactiveTabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  activeGradient: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
    borderWidth: 0,
    // iOS shadow
    shadowColor: '#A259FF',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    // Android shadow
    elevation: 8,
  },
  activeIcon: {
    width: 20,
    height: 20,
    tintColor: '#ffffff',
  },
  inactiveIcon: {
    width: 20,
    height: 20,
    tintColor: '#9E9E9E',
  },
});
