import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  marginBottom?: number;
  marginTop?: number;
  marginHorizontal?: number;
}

const SkeletonBox: React.FC<SkeletonProps> = ({
  width: boxWidth = '100%',
  height: boxHeight = 20,
  borderRadius = 4,
  marginBottom = 0,
  marginTop = 0,
  marginHorizontal = 0,
}) => {
  return (
    <View
      style={[
        styles.skeletonBox,
        {
          width: boxWidth,
          height: boxHeight,
          borderRadius,
          marginBottom,
          marginTop,
          marginHorizontal,
        },
      ]}
    >
      <LinearGradient
        colors={['#2a2a2a', '#3a3a3a', '#2a2a2a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, { borderRadius }]}
      />
    </View>
  );
};

export const MovieInfoSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Poster Banner Skeleton */}
      <View style={styles.posterContainer}>
        <SkeletonBox
          width="100%"
          height={height * 0.6}
          borderRadius={0}
        />
        
        {/* Header Skeleton */}
        <View style={styles.headerSkeleton}>
          <SkeletonBox width={40} height={40} borderRadius={20} />
          <View style={styles.headerActionsSkeleton}>
            <SkeletonBox width={40} height={40} borderRadius={20} marginHorizontal={6} />
            <SkeletonBox width={40} height={40} borderRadius={20} />
          </View>
        </View>
        
        {/* Platform Logo Skeleton */}
        <View style={styles.platformLogoSkeleton}>
          <SkeletonBox width={80} height={20} borderRadius={6} />
        </View>
        
        {/* Play Button Skeleton */}
        <View style={styles.playButtonSkeleton}>
          <SkeletonBox width={60} height={60} borderRadius={30} />
        </View>
      </View>

      {/* Movie Details Skeleton */}
      <View style={styles.movieDetailsSkeleton}>
        {/* Title and Genre */}
        <SkeletonBox width="80%" height={32} borderRadius={4} marginBottom={8} />
        <SkeletonBox width="60%" height={18} borderRadius={4} marginBottom={20} />
        
        {/* Info Boxes */}
        <View style={styles.infoBoxesSkeleton}>
          <SkeletonBox width="30%" height={60} borderRadius={8} marginHorizontal={4} />
          <SkeletonBox width="30%" height={60} borderRadius={8} marginHorizontal={4} />
          <SkeletonBox width="30%" height={60} borderRadius={8} marginHorizontal={4} />
        </View>
        
        {/* Synopsis Skeleton */}
        <View style={styles.synopsisSkeleton}>
          <SkeletonBox width="100%" height={16} borderRadius={4} marginBottom={8} />
          <SkeletonBox width="100%" height={16} borderRadius={4} marginBottom={8} />
          <SkeletonBox width="100%" height={16} borderRadius={4} marginBottom={8} />
          <SkeletonBox width="70%" height={16} borderRadius={4} marginBottom={16} />
          <SkeletonBox width={100} height={16} borderRadius={4} />
        </View>
        
        {/* Cast Section Skeleton */}
        <View style={styles.castSkeleton}>
          <SkeletonBox width={120} height={24} borderRadius={4} marginBottom={16} />
          <View style={styles.castScrollSkeleton}>
            {[1, 2, 3, 4, 5].map((item) => (
              <View key={item} style={styles.castMemberSkeleton}>
                <SkeletonBox width={60} height={60} borderRadius={30} marginBottom={8} />
                <SkeletonBox width={70} height={12} borderRadius={4} marginBottom={4} />
                <SkeletonBox width={50} height={10} borderRadius={4} />
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  posterContainer: {
    height: height * 0.6,
    width: '100%',
    position: 'relative',
  },
  skeletonBox: {
    backgroundColor: '#2a2a2a',
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  headerSkeleton: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerActionsSkeleton: {
    flexDirection: 'row',
  },
  platformLogoSkeleton: {
    position: 'absolute',
    top: 100,
    left: 20,
    zIndex: 5,
  },
  playButtonSkeleton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    zIndex: 5,
  },
  movieDetailsSkeleton: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    backgroundColor: '#000000',
    paddingTop: 20,
  },
  infoBoxesSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  synopsisSkeleton: {
    marginBottom: 32,
  },
  castSkeleton: {
    marginBottom: 20,
  },
  castScrollSkeleton: {
    flexDirection: 'row',
  },
  castMemberSkeleton: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
});
