// Base types for the streaming app
export interface BaseEntity {
  id: number;
  title: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

// Movie types
export interface Movie extends BaseEntity {
  type: 'Movie';
  year: number;
  rating: number;
  duration: string;
  genre: string;
  description: string;
  trailerUrl?: string;
  director?: string;
  cast?: string[];
  isFeatured?: boolean;
  isNewRelease?: boolean;
  platform?: string;
}

// Series types
export interface Series extends BaseEntity {
  type: 'Series';
  year: number;
  rating: number;
  genre: string;
  description: string;
  seasons: number;
  episodes: number;
  status: 'ongoing' | 'completed' | 'cancelled';
  isFeatured?: boolean;
  isNewRelease?: boolean;
  platform?: string;
}

// Live TV types
export interface LiveTV extends BaseEntity {
  type: 'Live TV';
  channelNumber: string;
  category: string;
  isLive: boolean;
  currentProgram?: string;
  nextProgram?: string;
  platform?: string;
}

// Union type for all content
export type Content = Movie | Series | LiveTV;

// Search types
export interface SearchResult extends BaseEntity {
  type: 'Movie' | 'Series' | 'Live TV';
  year: string;
  rating: string;
  category?: string;
}

export interface SearchParams {
  query: string;
  type?: 'Movie' | 'Series' | 'Live TV';
  page?: number;
  limit?: number;
  genre?: string;
  year?: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Response types for hero carousel
export interface HeroCarouselItem {
  _id: string;
  title: string;
  description: string;
  backdropImage: string;
  active: boolean;
  sortOrder: number;
  movie_id: {
    _id: string;
    provider: string;
    stream_id: number;
    name: string;
    rating: number;
    rating_5based: number;
    status: string;
    stream_icon: string;
    stream_type: string;
    title: string;
    year: string | null;
    actors: string;
    cast: string;
    country: string;
    cover_big: string;
    description: string;
    director: string;
    duration: string;
    duration_secs: number;
    episode_run_time: number;
    genre: string;
    kinopoisk_url: string;
    movie_image: string;
    o_name: string;
    plot: string;
    rating_count_kinopoisk: number;
    releasedate: string | null;
    tmdb_id: number;
    youtube_trailer: string | null;
    mpaa_rating?: string;
    release_date?: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface HeroCarouselResponse {
  success: boolean;
  count: number;
  data: HeroCarouselItem[];
}

// API Response types for movie details
export interface MovieDetails {
  _id: string;
  provider: string;
  stream_id: number;
  __v: number;
  added: string;
  backdrop_path: any[];
  category_id: string;
  category_ids: number[];
  container_extension: string;
  createdAt: string;
  custom_sid: string;
  direct_source: string;
  feature: boolean;
  flag: boolean;
  name: string;
  num: number;
  rating: number;
  rating_5based: number;
  status: string;
  stream_icon: string;
  stream_type: string;
  subtitles: any[];
  title: string;
  updatedAt: string;
  year: string | null;
  actors: string;
  age: string;
  bitrate: number;
  cast: string;
  country: string;
  cover_big: string;
  description: string;
  director: string;
  duration: string;
  duration_secs: number;
  episode_run_time: number;
  genre: string;
  kinopoisk_url: string;
  movie_image: string;
  o_name: string;
  plot: string;
  rating_count_kinopoisk: number;
  releasedate: string | null;
  tmdb_id: number;
  youtube_trailer: string;
  mpaa_rating?: string;
  release_date?: string;
}

export interface SimilarMovie {
  _id: string;
  stream_id: number;
  provider: string;
  __v: number;
  added: string;
  backdrop_path: any[];
  category_id: string;
  category_ids: number[];
  container_extension: string;
  createdAt: string;
  custom_sid: string;
  direct_source: string;
  feature: boolean;
  flag: boolean;
  name: string;
  num: number;
  rating: number;
  rating_5based: number;
  status: string;
  stream_icon: string;
  stream_type: string;
  subtitles: any[];
  title: string;
  updatedAt: string;
  year: string | null;
  actors?: string;
  age?: string;
  bitrate?: number;
  cast?: string;
  country?: string;
  cover_big?: string;
  description?: string;
  director?: string;
  duration?: string;
  duration_secs?: number;
  episode_run_time?: number;
  genre?: string;
  kinopoisk_url?: string;
  movie_image?: string;
  mpaa_rating?: string;
  o_name?: string;
  plot?: string;
  rating_count_kinopoisk?: number;
  release_date?: string;
  releasedate?: string;
  tmdb_id?: number;
  youtube_trailer?: string;
}

export interface SimilarMoviesCategory {
  category_id: string;
  movies: SimilarMovie[];
}

export interface MovieDetailsResponse {
  success: boolean;
  data: MovieDetails;
  similarMovies: SimilarMoviesCategory[];
}

// Featured content types (for backward compatibility)
export interface FeaturedContent {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  genre: string;
  year: number;
  rating: number;
  duration?: string;
  image: string;
  trailerUrl?: string;
  type: 'Movie' | 'Series';
}

// Section types
export interface MovieSection {
  id: string;
  title: string;
  movies: Movie[];
  type: 'trending' | 'new_releases' | 'genre' | 'platform';
}

// User types
export interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  preferences?: {
    favoriteGenres: string[];
    favoritePlatforms: string[];
  };
}

// Wishlist types
export interface WishlistItem {
  id: number;
  contentId: number;
  contentType: 'Movie' | 'Series' | 'Live TV';
  addedAt: string;
  content: Content;
}

// Error types
export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: any;
}

// VOD Categories API Types
export interface VODCategory {
  _id: string;
  category_id: string;
  category_name: string;
  parent_id: string | null;
  provider: string;
  category_type: string;
  blacklisted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  children: any[];
}

export interface VODCategoriesResponse {
  success: boolean;
  count: number;
  data: VODCategory[];
}

export interface SeriesCategory {
  _id: string;
  category_id: string;
  category_name: string;
  parent_id: string | null;
  provider: string;
  category_type: string;
  blacklisted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  children: any[];
}

export interface SeriesCategoriesResponse {
  success: boolean;
  count: number;
  data: SeriesCategory[];
}

export interface LiveTvCategory {
  _id: string;
  category_id: string;
  category_name: string;
  parent_id: string | null;
  provider: string;
  category_type: string;
  blacklisted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  children: any[];
}

export interface LiveTvCategoriesResponse {
  success: boolean;
  count: number;
  data: LiveTvCategory[];
}

// Live TV API Types
export interface LiveTvItem {
  _id: string;
  provider: string;
  stream_id: number;
  __v: number;
  added: string;
  category_id: string;
  category_ids: number[];
  createdAt: string;
  custom_sid: string;
  direct_source: string;
  epg_channel_id: string | null;
  feature: boolean;
  name: string;
  num: number;
  status: string;
  stream_icon: string;
  stream_type: string;
  thumbnail: string;
  tv_archive: number;
  tv_archive_duration: number;
  updatedAt: string;
}

export interface LiveTvResponse {
  streams: LiveTvItem[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  filters: {
    search: string;
    category_id: string;
  };
}

// EPG API Types
export interface EpgListing {
  id: string;
  epg_id: string;
  title: string;
  lang: string;
  start: string;
  end: string;
  description: string;
  channel_id: string;
  start_timestamp: string;
  stop_timestamp: string;
  stop: string;
  title_decoded: string;
  description_decoded: string;
  title_encoded: string;
  description_encoded: string;
}

export interface EpgData {
  epg_listings: EpgListing[];
}

export interface EpgResponse {
  success: boolean;
  data: {
    stream_id: string;
    provider_name: string;
    provider_id: string;
    epg_data: EpgData;
  };
}

// Series API Types
export interface SeriesItem {
  _id: string;
  provider: string;
  series_id: number;
  __v: number;
  backdrop_path: string[];
  cast: string;
  category_id: string;
  category_ids: number[];
  cover: string;
  createdAt: string;
  director: string;
  episode_run_time: string;
  feature: boolean;
  flag: boolean;
  genre: string;
  last_modified: string;
  name: string;
  num: number;
  plot: string;
  rating: string;
  rating_5based: number;
  releaseDate: string;
  release_date: string;
  seasons: SeriesSeason[];
  status: string;
  stream_type: string;
  title: string;
  updatedAt: string;
  year: string;
  youtube_trailer: string;
  episodes: Record<string, SeriesEpisode[]>;
}

export interface SeriesSeason {
  air_date: string;
  episode_count: string;
  name: string;
  overview: string;
  season_number: string;
  cover: string;
  cover_big: string;
  vote_average: number;
}

export interface SeriesEpisode {
  id: string;
  episode_num: string;
  title: string;
  container_extension: string;
  info: {
    releasedate: string;
    plot: string;
    duration_secs: number;
    duration: string;
    movie_image: string;
    bitrate: number;
    rating: number;
    season: string;
    tmdb_id: string;
    cover_big: string;
  };
  subtitles: any[];
  custom_sid: string;
  added: string;
  season: number;
  direct_source: string;
}

export interface SeriesPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SeriesFilters {
  search: string;
  category_id: string;
}

export interface SeriesResponse {
  success: boolean;
  series: SeriesItem[];
  pagination: SeriesPagination;
  filters: SeriesFilters;
}

// Movies API Types
export interface MovieStream {
  _id: string;
  provider: string;
  stream_id: number;
  __v: number;
  added: string;
  backdrop_path: string[];
  category_id: string;
  category_ids: number[];
  container_extension: string;
  createdAt: string;
  custom_sid: string;
  direct_source: string;
  feature: boolean;
  flag: boolean;
  name: string;
  num: number;
  rating: number;
  rating_5based: number;
  status: string;
  stream_icon: string;
  stream_type: string;
  subtitles: any[];
  title: string;
  updatedAt: string;
  year: string;
  actors?: string;
  age?: string;
  bitrate?: number;
  cast?: string;
  country?: string;
  cover_big?: string;
  description?: string;
  director?: string;
  duration?: string;
  duration_secs?: number;
  episode_run_time?: number;
  genre?: string;
  kinopoisk_url?: string;
  movie_image?: string;
  mpaa_rating?: string;
  o_name?: string;
  plot?: string;
  rating_count_kinopoisk?: number;
  release_date?: string;
  releasedate?: string;
  tmdb_id?: number;
  youtube_trailer?: string | null;
}

export interface MoviesPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface MoviesFilters {
  search: string;
  category_id: string;
}

export interface MoviesResponse {
  streams: MovieStream[];
  pagination: MoviesPagination;
  filters: MoviesFilters;
}

// Sections API Types
export interface SectionMovie {
  _id: string;
  provider: string;
  stream_id: number;
  __v: number;
  added: string;
  backdrop_path: any[];
  category_id: string;
  category_ids: number[];
  container_extension: string;
  createdAt: string;
  custom_sid: string;
  direct_source: string;
  feature: boolean;
  flag: boolean;
  name: string;
  num: number;
  rating: number;
  rating_5based: number;
  status: string;
  stream_icon: string;
  stream_type: string;
  subtitles: any[];
  title: string;
  updatedAt: string;
  year: string | null;
}

export interface CategoryMovies {
  category_id: string;
  movies: SectionMovie[];
}

export interface Section {
  _id: string;
  sectionId: string;
  title: string;
  description: string;
  contentType: string;
  sortOrder: number;
  active: boolean;
  selectedCategoryIds: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  categoryMovies: CategoryMovies[];
}

export interface SectionsResponse {
  success: boolean;
  count: number;
  data: Section[];
}

// Series Sections API Types
export interface SeriesSectionItem {
  _id: string;
  provider: string;
  series_id: number;
  __v: number;
  backdrop_path: string[];
  cast: string;
  category_id: string;
  category_ids: number[];
  cover: string;
  createdAt: string;
  director: string;
  episode_run_time: string;
  feature: boolean;
  flag: boolean;
  genre: string;
  last_modified: string;
  name: string;
  num: number;
  plot: string;
  rating: string;
  rating_5based: number;
  releaseDate: string | null;
  release_date: string | null;
  seasons: any[];
  status: string;
  stream_type: string;
  title: string;
  updatedAt: string;
  year: string;
  youtube_trailer: string | null;
}

export interface CategorySeries {
  category_id: string;
  series: SeriesSectionItem[];
}

export interface SeriesSection {
  _id: string;
  sectionId: string;
  title: string;
  description: string;
  contentType: string;
  sortOrder: number;
  active: boolean;
  selectedCategoryIds: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  categorySeries: CategorySeries[];
}

export interface SeriesSectionsResponse {
  success: boolean;
  count: number;
  data: SeriesSection[];
}

// Live TV Sections Types
export interface LiveTvSectionItem {
  _id: string;
  stream_id: number;
  name: string;
  stream_icon: string;
  status: string;
  category_id: string;
  category_ids: number[];
  stream_type: string;
  [key: string]: any;
}

export interface CategoryLiveTv {
  category_id: string;
  movies: LiveTvSectionItem[];
}

export interface LiveTvSection {
  _id: string;
  sectionId: string;
  title: string;
  description: string;
  contentType: string;
  sortOrder: number;
  backdropImage?: string;
  active: boolean;
  selectedCategoryIds: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  categoryMovies: CategoryLiveTv[];
}

export interface LiveTvSectionsResponse {
  success: boolean;
  count: number;
  data: LiveTvSection[];
}