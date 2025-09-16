import { ENDPOINTS } from '../constants/api';

// Hero Carousel Service
export const heroCarouselService = {
  getHeroCarousel: () => ({
    method: 'GET',
    url: ENDPOINTS.HERO_CAROUSEL,
  }),
};

// Movies Service (placeholder for future implementation)
export const moviesService = {
  getMovies: (params?: any) => ({
    method: 'GET',
    url: ENDPOINTS.MOVIES,
    params,
  }),
  
  getMovieDetails: (id: number) => ({
    method: 'GET',
    url: ENDPOINTS.MOVIE_DETAILS.replace(':id', id.toString()),
  }),
  
  getFeaturedMovies: () => ({
    method: 'GET',
    url: ENDPOINTS.FEATURED_MOVIES,
  }),
  
  getTrendingMovies: () => ({
    method: 'GET',
    url: ENDPOINTS.TRENDING_MOVIES,
  }),
};

// Series Service (placeholder for future implementation)
export const seriesService = {
  getSeries: (params?: any) => ({
    method: 'GET',
    url: ENDPOINTS.SERIES,
    params,
  }),
  
  getSeriesDetails: (id: number) => ({
    method: 'GET',
    url: ENDPOINTS.SERIES_DETAILS.replace(':id', id.toString()),
  }),
  
  getFeaturedSeries: () => ({
    method: 'GET',
    url: ENDPOINTS.FEATURED_SERIES,
  }),
  
  getTrendingSeries: () => ({
    method: 'GET',
    url: ENDPOINTS.TRENDING_SERIES,
  }),
};

// Search Service (placeholder for future implementation)
export const searchService = {
  search: (query: string, params?: any) => ({
    method: 'GET',
    url: ENDPOINTS.SEARCH,
    params: { q: query, ...params },
  }),
};

// Live TV Service (placeholder for future implementation)
export const liveTvService = {
  getChannels: () => ({
    method: 'GET',
    url: ENDPOINTS.LIVE_CHANNELS,
  }),
  
  getChannelDetails: (id: number) => ({
    method: 'GET',
    url: ENDPOINTS.LIVE_TV_DETAILS.replace(':id', id.toString()),
  }),
};

// User Service (placeholder for future implementation)
export const userService = {
  getProfile: () => ({
    method: 'GET',
    url: ENDPOINTS.USER,
  }),
  
  getWishlist: () => ({
    method: 'GET',
    url: ENDPOINTS.WISHLIST,
  }),
  
  addToWishlist: (contentId: number, contentType: string) => ({
    method: 'POST',
    url: ENDPOINTS.WISHLIST,
    data: { contentId, contentType },
  }),
  
  removeFromWishlist: (itemId: number) => ({
    method: 'DELETE',
    url: `${ENDPOINTS.WISHLIST}/${itemId}`,
  }),
};

// Export all services
export const services = {
  heroCarousel: heroCarouselService,
  movies: moviesService,
  series: seriesService,
  search: searchService,
  liveTv: liveTvService,
  user: userService,
};
