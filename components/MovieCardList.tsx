import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import MovieCard, { MovieItem } from './MovieCard';

interface MovieCardListProps {
  data: MovieItem[];
  onCardPress?: (item: MovieItem) => void;
  variant?: 'horizontal' | 'grid';
  style?: any;
}

const MovieCardList: React.FC<MovieCardListProps> = ({ 
  data, 
  onCardPress, 
  variant = 'horizontal',
  style 
}) => {
  if (variant === 'grid') {
    return (
      <View style={[styles.gridContainer, style]}>
        {data.map((item) => (
          <MovieCard
            key={item.id}
            item={item}
            onPress={onCardPress}
            variant="grid"
          />
        ))}
      </View>
    );
  }

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.horizontalScroll, style]}
    >
      {data.map((item) => (
        <MovieCard
          key={item.id}
          item={item}
          onPress={onCardPress}
          variant="default"
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  horizontalScroll: {
    paddingHorizontal: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 15,
  },
});

export default MovieCardList;
