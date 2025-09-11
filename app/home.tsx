import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import HeroCarousel, { FeaturedMovie } from '../components/HeroCarousel';
import MovieSection from '../components/MovieSection';

// Featured movies data for hero carousel
const featuredMovies: FeaturedMovie[] = [
  {
    id: 1,
    title: 'MOBLAND',
    subtitle: 'Paramount+ Original',
    description: 'Two highly-trained operatives are appointed to posts in guard towers on opposite sides of a vast and highly classified gorge, protecting the world from a mysterious evil that lurks within.',
    genre: 'Action',
    year: 2025,
    rating: 7.2,
    duration: '102 min',
    image: 'https://bollynewsuk.com/wp-content/uploads/2023/07/heart-of-stone-uk-netflix-poster-2.jpg' // [1][3][13]
  },
  {
    id: 2,
    title: 'ADOLESCENCE',
    subtitle: 'Netflix Original Series',
    description: 'A coming-of-age story about a young person navigating the complexities of adolescence, friendship, and self-discovery in a modern world.',
    genre: 'Drama',
    year: 2025,
    rating: 8.1,
    duration: '45 min',
    image: 'https://pbs.twimg.com/media/Ec_7SzOUEAAuGit.jpg:large' // [14]
  },
  {
    id: 3,
    title: 'WOLFMAN',
    subtitle: 'HBO Max Exclusive',
    description: 'A thrilling supernatural horror film that follows the transformation of a man into a werewolf and his struggle to control his newfound powers.',
    genre: 'Horror',
    year: 2025,
    rating: 6.8,
    duration: '118 min',
    image: 'https://www.tallengestore.com/cdn/shop/products/Extraction-ChrisHemsworth-NetflixHollywoodBlockbusterEnglishMoviePoster_01e59f1b-5364-4d6c-b17f-b8ffea84fd1e.jpg?v=1589271987' // [7][15]
  },
  {
    id: 4,
    title: 'EVERYTHING',
    subtitle: 'Amazon Prime Original',
    description: 'An epic sci-fi adventure that explores the mysteries of the universe and humanity\'s place within it through stunning visuals and compelling storytelling.',
    genre: 'Sci-Fi',
    year: 2025,
    rating: 8.5,
    duration: '142 min',
    image: 'https://cdn.dribbble.com/userupload/15632169/file/original-e8c1abbabd1f0100eeb8a927258db3d9.jpg?resize=400x0' // Sample Google image search for placeholder, replace with preferred public image
  },
  {
    id: 5,
    title: 'SHADOW REALM',
    subtitle: 'Disney+ Special',
    description: 'A fantasy tale where a young warrior must cross into the Shadow Realm to save their village from an ancient curse.',
    genre: 'Fantasy',
    year: 2025,
    rating: 7.9,
    duration: '129 min',
    image: 'https://cdn.europosters.eu/image/350/posters/wednesday-umbrella-i185538.jpg' // [9]
  },
  {
    id: 6,
    title: 'NEON FUTURE',
    subtitle: 'Apple TV+ Original',
    description: 'Set in a cyberpunk future, a hacker discovers a secret that could redefine the relationship between man and machine.',
    genre: 'Sci-Fi',
    year: 2025,
    rating: 8.3,
    duration: '124 min',
    image: 'https://cdn01.justjaredjr.com/wp-content/uploads/2020/08/millie-enola-poster/millie-bobby-brown-shares-enola-holmes-movie-poster-01.jpg' // Unsplash search for public cyberpunk/neon future imagery
  },
  {
    id: 7,
    title: 'LAST HAVEN',
    subtitle: 'Peacock Exclusive',
    description: 'In a post-apocalyptic world, a small town becomes the last safe haven for humanity as outside forces threaten to invade.',
    genre: 'Thriller',
    year: 2025,
    rating: 7.5,
    duration: '131 min',
    image: 'https://static1.tribute.ca/poster/660x980/bright-netflix-122195.jpg' // Unsplash search for public dystopian/safe haven imagery
  },
  {
    id: 8,
    title: 'MOONFALL',
    subtitle: 'Lionsgate Pictures',
    description: 'As the moon is knocked off orbit, a team of astronauts must prevent it from crashing into Earth in a desperate race against time.',
    genre: 'Sci-Fi',
    year: 2025,
    rating: 6.7,
    duration: '120 min',
    image: 'https://www.tallengestore.com/cdn/shop/products/MoneyHeist-Professor-NetflixTVShowMoviePoster_68fb5595-7dfc-4c95-ab4d-36237da1cebd.jpg?v=1589789097' // [20]
  },
  {
    id: 9,
    title: 'THE LOST SONG',
    subtitle: 'Hulu Exclusive',
    description: 'A deeply emotional musical journey about a prodigy searching for a legendary lost symphony that holds secrets to her past.',
    genre: 'Musical/Drama',
    year: 2025,
    rating: 8.0,
    duration: '137 min',
    image: 'https://mlpnk72yciwc.i.optimole.com/cqhiHLc.IIZS~2ef73/w:auto/h:auto/q:75/https://bleedingcool.com/wp-content/uploads/2018/07/extinction.jpg' // Pexels public image, music/concert thematic
  },
  {
    id: 10,
    title: 'GHOST PROTOCOL',
    subtitle: 'Universal Pictures',
    description: 'A suspenseful spy thriller where an undercover agent must stop an international conspiracy before the world descends into chaos.',
    genre: 'Action/Thriller',
    year: 2025,
    rating: 8.4,
    duration: '118 min',
    image: 'https://i0.wp.com/screen-connections.com/wp-content/uploads/2021/10/Red.Notice-Official.One_.Sheet_.Poster-01.jpg?resize=691%2C1024&ssl=1' // Unsplash public spy/thriller aesthetic
  }
];

// Sample data for movie sections using featured movies' image URLs
const todaysTopPicks = [
  {
    id: 1,
    title: 'MOBLAND',
    poster: 'https://bollynewsuk.com/wp-content/uploads/2023/07/heart-of-stone-uk-netflix-poster-2.jpg'
  },
  {
    id: 2,
    title: 'ADOLESCENCE',
    poster: 'https://pbs.twimg.com/media/Ec_7SzOUEAAuGit.jpg:large'
  },
  {
    id: 3,
    title: 'WOLFMAN',
    poster: 'https://www.tallengestore.com/cdn/shop/products/Extraction-ChrisHemsworth-NetflixHollywoodBlockbusterEnglishMoviePoster_01e59f1b-5364-4d6c-b17f-b8ffea84fd1e.jpg?v=1589271987'
  },
  {
    id: 4,
    title: 'EVERYTHING',
    poster: 'https://cdn.dribbble.com/userupload/15632169/file/original-e8c1abbabd1f0100eeb8a927258db3d9.jpg?resize=400x0'
  },
  {
    id: 5,
    title: 'SHADOW REALM',
    poster: 'https://cdn.europosters.eu/image/350/posters/wednesday-umbrella-i185538.jpg'
  }
];

const koreanDramas = [
  {
    id: 6,
    title: 'NEON FUTURE',
    poster: 'https://cdn01.justjaredjr.com/wp-content/uploads/2020/08/millie-enola-poster/millie-bobby-brown-shares-enola-holmes-movie-poster-01.jpg'
  },
  {
    id: 7,
    title: 'LAST HAVEN',
    poster: 'https://static1.tribute.ca/poster/660x980/bright-netflix-122195.jpg'
  },
  {
    id: 8,
    title: 'MOONFALL',
    poster: 'https://www.tallengestore.com/cdn/shop/products/MoneyHeist-Professor-NetflixTVShowMoviePoster_68fb5595-7dfc-4c95-ab4d-36237da1cebd.jpg?v=1589789097'
  },
  {
    id: 9,
    title: 'THE LOST SONG',
    poster: 'https://mlpnk72yciwc.i.optimole.com/cqhiHLc.IIZS~2ef73/w:auto/h:auto/q:75/https://bleedingcool.com/wp-content/uploads/2018/07/extinction.jpg'
  }
];

const crimeThrillers = [
  {
    id: 10,
    title: 'GHOST PROTOCOL',
    poster: 'https://i0.wp.com/screen-connections.com/wp-content/uploads/2021/10/Red.Notice-Official.One_.Sheet_.Poster-01.jpg?resize=691%2C1024&ssl=1'
  },
  {
    id: 11,
    title: 'MOBLAND',
    poster: 'https://bollynewsuk.com/wp-content/uploads/2023/07/heart-of-stone-uk-netflix-poster-2.jpg'
  },
  {
    id: 12,
    title: 'WOLFMAN',
    poster: 'https://www.tallengestore.com/cdn/shop/products/Extraction-ChrisHemsworth-NetflixHollywoodBlockbusterEnglishMoviePoster_01e59f1b-5364-4d6c-b17f-b8ffea84fd1e.jpg?v=1589271987'
  },
  {
    id: 13,
    title: 'EVERYTHING',
    poster: 'https://cdn.dribbble.com/userupload/15632169/file/original-e8c1abbabd1f0100eeb8a927258db3d9.jpg?resize=400x0'
  }
];

const awardWinningThrillers = [
  {
    id: 14,
    title: 'SHADOW REALM',
    poster: 'https://cdn.europosters.eu/image/350/posters/wednesday-umbrella-i185538.jpg'
  },
  {
    id: 15,
    title: 'NEON FUTURE',
    poster: 'https://cdn01.justjaredjr.com/wp-content/uploads/2020/08/millie-enola-poster/millie-bobby-brown-shares-enola-holmes-movie-poster-01.jpg'
  },
  {
    id: 16,
    title: 'LAST HAVEN',
    poster: 'https://static1.tribute.ca/poster/660x980/bright-netflix-122195.jpg'
  },
  {
    id: 17,
    title: 'MOONFALL',
    poster: 'https://www.tallengestore.com/cdn/shop/products/MoneyHeist-Professor-NetflixTVShowMoviePoster_68fb5595-7dfc-4c95-ab4d-36237da1cebd.jpg?v=1589789097'
  }
];

interface HomePageProps {
  onToggleBottomNav?: (hide: boolean) => void;
}

export default function HomePage({ onToggleBottomNav }: HomePageProps) {
  const [selectedMovie, setSelectedMovie] = useState<FeaturedMovie | null>(null);

  const handleMoviePress = (movie: FeaturedMovie) => {
    console.log('Movie pressed:', movie.title);
    setSelectedMovie(movie);
    // You can add navigation to movie details here
  };

  const handlePlayPress = (movie: FeaturedMovie) => {
    console.log('Play pressed:', movie.title);
    // You can add video player logic here
    onToggleBottomNav?.(true); // Hide bottom navigation when playing
  };

  const handleSectionMoviePress = (movie: any) => {
    console.log('Section movie pressed:', movie.title);
    // You can add navigation to movie details here
  };

  // Log the featured movies data for debugging
  console.log('Featured movies loaded:', featuredMovies.length);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Carousel Section */}
        <HeroCarousel
          movies={featuredMovies}
          onMoviePress={handleMoviePress}
          onPlayPress={handlePlayPress}
        />
        
        {/* Movie Sections */}
        <MovieSection
          title="Today's Top Picks for You"
          movies={todaysTopPicks}
          onMoviePress={handleSectionMoviePress}
        />
        
        <MovieSection
          title="Korean TV Dramas"
          movies={koreanDramas}
          onMoviePress={handleSectionMoviePress}
        />
        
        <MovieSection
          title="Crime Stories with a Romance Twist"
          movies={crimeThrillers}
          onMoviePress={handleSectionMoviePress}
        />
        
        <MovieSection
          title="Award-winning Binge-worthy Crime TV Thrillers"
          movies={awardWinningThrillers}
          onMoviePress={handleSectionMoviePress}
        />
        
        {/* Bottom padding to prevent overlap with bottom navigation */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Extra space for bottom navigation (80px height + 40px padding)
  },
  bottomPadding: {
    height: 40, // Additional padding at the bottom
  },
});
