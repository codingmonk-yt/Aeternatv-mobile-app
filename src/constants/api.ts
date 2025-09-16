// API Configuration Constants
export const API_CONFIG = {
  // Base URL - update this with your actual base URL
  BASE_URL: 'http://api.aeternatv.com', // Replace with your actual base URL
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// API Endpoints - will be populated as you provide them
export const ENDPOINTS = {
  // Hero Carousel
  HERO_CAROUSEL: '/api/public/hero-carousel',
  
  // Movies
  MOVIES: '/movies',
  MOVIE_DETAILS: '/movies/:id',
  FEATURED_MOVIES: '/movies/featured',
  TRENDING_MOVIES: '/movies/trending',
  
  // Series
  SERIES: '/series',
  SERIES_DETAILS: '/series/:id',
  FEATURED_SERIES: '/series/featured',
  TRENDING_SERIES: '/series/trending',
  
  // Live TV
  LIVE_TV: '/live-tv',
  LIVE_TV_DETAILS: '/live-tv/:id',
  LIVE_CHANNELS: '/live-tv/channels',
  
  // Search
  SEARCH: '/search',
  
  // User
  USER: '/user',
  WISHLIST: '/user/wishlist',
  
  // Categories/Sections
  SECTIONS: '/sections',
  GENRES: '/genres',
  PLATFORMS: '/platforms',
} as const;

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;

// Query Keys for TanStack Query
export const QUERY_KEYS = {
  // Hero Carousel
  HERO_CAROUSEL: 'hero-carousel',
  
  // Movies
  MOVIES: 'movies',
  MOVIE_DETAILS: 'movie-details',
  FEATURED_MOVIES: 'featured-movies',
  TRENDING_MOVIES: 'trending-movies',
  
  // Series
  SERIES: 'series',
  SERIES_DETAILS: 'series-details',
  FEATURED_SERIES: 'featured-series',
  TRENDING_SERIES: 'trending-series',
  
  // Live TV
  LIVE_TV: 'live-tv',
  LIVE_TV_DETAILS: 'live-tv-details',
  LIVE_CHANNELS: 'live-channels',
  
  // Search
  SEARCH: 'search',
  
  // User
  USER: 'user',
  WISHLIST: 'wishlist',
  
  // Sections
  SECTIONS: 'sections',
  GENRES: 'genres',
  PLATFORMS: 'platforms',
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  REFETCH_ON_WINDOW_FOCUS: false,
  REFETCH_ON_RECONNECT: true,
  RETRY: 3,
} as const;
