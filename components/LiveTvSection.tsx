import React from 'react';
import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { getResponsiveCardWidth, getResponsiveSpacing, responsiveStyles } from '../src/utils/responsive';
import LiveTvCard from './LiveTvCard';

const { width } = Dimensions.get('window');
const itemWidth = getResponsiveCardWidth(); // Responsive card width based on screen size

interface LiveTvSectionProps {
  title: string;
  channels: any[];
  onChannelPress: (channel: any) => void;
}

export default function LiveTvSection({ title, channels, onChannelPress }: LiveTvSectionProps) {
  if (channels.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>
        <FlatList
          data={channels}
          renderItem={({ item }) => (
            <LiveTvCard
              channel={item}
              onPress={() => onChannelPress(item)}
              cardWidth={itemWidth}
            />
          )}
          keyExtractor={(item, index) => `${item._id}-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          ItemSeparatorComponent={() => <View style={{ width: getResponsiveSpacing(16) }} />}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: getResponsiveSpacing(32),
  },
  sectionTitle: {
    fontSize: responsiveStyles.subtitle.fontSize,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: getResponsiveSpacing(16),
    paddingHorizontal: getResponsiveSpacing(20),
  },
  scrollContent: {
    paddingHorizontal: getResponsiveSpacing(20),
    paddingRight: getResponsiveSpacing(40), // Extra padding for better scrolling experience
  },
});
