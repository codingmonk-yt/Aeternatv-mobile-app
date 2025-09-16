import React, { useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getResponsiveSpacing, responsiveStyles } from '../src/utils/responsive';

interface LiveTvCardProps {
  channel: {
    _id: string;
    name: string;
    stream_id: number;
    stream_icon: string;
    status: string;
    category_id: string;
    [key: string]: any;
  };
  onPress: () => void;
  cardWidth: number;
}

export default function LiveTvCard({ channel, onPress, cardWidth }: LiveTvCardProps) {
  const [imageError, setImageError] = useState(false);

  const imageUrl = channel.stream_icon;
  const hasValidImage = imageUrl && imageUrl.trim() !== '';

  React.useEffect(() => {
    setImageError(false);
  }, [channel._id]);

  return (
    <TouchableOpacity
      style={[styles.liveTvCard, { width: cardWidth, height: cardWidth * 1.5 }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {hasValidImage && !imageError ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.liveTvImage}
          onError={() => {
            setImageError(true);
            console.log('Image failed to load for channel:', channel.name);
          }}
        />
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderIcon}>📺</Text>
          <Text style={styles.placeholderText} numberOfLines={2}>
            {channel.name}
          </Text>
        </View>
      )}
      <View style={styles.liveTvOverlay}>
        <Text style={styles.liveTvTitle} numberOfLines={2}>
          {channel.name}
        </Text>
        <Text style={styles.liveTvStatus}>Live TV</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  liveTvCard: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
  },
  liveTvImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2a2a2a',
    objectFit: "contain"
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 8,
  },
  placeholderIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 12,
  },
  liveTvOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: getResponsiveSpacing(6),
  },
  liveTvTitle: {
    fontSize: responsiveStyles.small.fontSize,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: getResponsiveSpacing(2),
  },
  liveTvStatus: {
    fontSize: responsiveStyles.tiny.fontSize,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
