import React from 'react';
import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { getResponsiveCardWidth, getResponsiveSpacing, responsiveStyles } from '../src/utils/responsive';
import SeriesCard from './SeriesCard';

const { width } = Dimensions.get('window');
const itemWidth = getResponsiveCardWidth(); // Use responsive card width

interface SeriesSectionProps {
  title: string;
  series: any[];
  onSeriesPress: (series: any) => void;
}

export default function SeriesSection({ title, series, onSeriesPress }: SeriesSectionProps) {
  if (!series || series.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>
        <FlatList
          data={series}
          renderItem={({ item }) => (
            <SeriesCard
              series={item}
              onPress={() => onSeriesPress(item)}
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
    fontFamily: responsiveStyles.subtitle.fontFamily,
    color: '#FFFFFF',
    marginBottom: getResponsiveSpacing(16),
    paddingHorizontal: getResponsiveSpacing(20),
  },
  scrollContent: {
    paddingHorizontal: getResponsiveSpacing(20),
    paddingRight: getResponsiveSpacing(40), // Extra padding for better scrolling experience
  },
});
