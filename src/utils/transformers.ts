import { FeaturedContent, HeroCarouselItem } from '../types';

// Transform API hero carousel item to FeaturedContent format
export const transformHeroCarouselItem = (item: HeroCarouselItem): FeaturedContent => {
  const movie = item.movie_id;
  
  return {
    id: movie._id, // Keep original _id - this was working correctly
    title: item.title,
    subtitle: movie.o_name !== item.title ? movie.o_name : undefined,
    description: item.description || movie.plot || movie.description,
    genre: movie.genre || 'Unknown',
    year: movie.year ? parseInt(movie.year) : new Date().getFullYear(),
    rating: movie.rating || 0,
    duration: movie.duration || `${movie.episode_run_time} min`,
    image: item.backdropImage || movie.cover_big || movie.movie_image,
    trailerUrl: movie.youtube_trailer || undefined,
    type: 'Movie' as const,
  };
};

// Transform multiple hero carousel items
export const transformHeroCarouselItems = (items: HeroCarouselItem[]): FeaturedContent[] => {
  return items.map(transformHeroCarouselItem);
};
