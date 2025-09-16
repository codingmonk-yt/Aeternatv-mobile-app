import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../../constants/api';
import { EpgResponse, HeroCarouselResponse, LiveTvCategoriesResponse, LiveTvResponse, LiveTvSectionsResponse, MovieDetailsResponse, MoviesResponse, SectionsResponse, SeriesCategoriesResponse, SeriesResponse, SeriesSectionsResponse, VODCategoriesResponse } from '../../types';

// Define the base query with base URL and common headers
const baseQuery = fetchBaseQuery({
  baseUrl: API_CONFIG.BASE_URL,
  prepareHeaders: (headers) => {
    // Add common headers here
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    
    // Add auth token if available (uncomment when auth is implemented)
    // const token = getAuthToken();
    // if (token) {
    //   headers.set('Authorization', `Bearer ${token}`);
    // }
    
    return headers;
  },
});

// Create the API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['HeroCarousel', 'Movies', 'Series', 'LiveTV', 'Search', 'MovieDetails', 'VODCategories', 'MoviesList', 'SeriesCategories', 'SeriesList', 'LiveTvCategories', 'LiveTvChannels', 'Epg', 'Sections', 'SeriesSections', 'LiveTvSections', 'StreamUrl', 'SeriesEpisodeStreamUrl', 'LiveTvStreamUrl'],
  endpoints: (builder) => ({
    // Hero Carousel endpoint
    getHeroCarousel: builder.query<HeroCarouselResponse, void>({
      query: () => '/api/public/hero-carousel',
      providesTags: ['HeroCarousel'],
    }),
    
    // Movie Details endpoint
    getMovieDetails: builder.query<MovieDetailsResponse, string>({
      query: (movieId) => `/api/public/movies/${movieId}`,
      providesTags: (result, error, movieId) => [
        { type: 'MovieDetails', id: movieId },
      ],
    }),
    
    getMovieDetailsById: builder.query<any, number>({
      query: (id) => `/movies/${id}`,
      providesTags: ['Movies'],
    }),
    
    // Series endpoint with pagination and filters
    getSeries: builder.query<SeriesResponse, { page: number; limit: number; search?: string; category_id?: string | null }>({
      query: ({ page, limit, search, category_id }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          search: search || '',
          category_id: category_id || '',
        });
        return `/api/public/series?${params.toString()}`;
      },
      providesTags: ['SeriesList'],
    }),
    
    getSeriesDetails: builder.query<any, number>({
      query: (id) => `/series/${id}`,
      providesTags: ['Series'],
    }),
    
    // Series Info by ID endpoint
    getSeriesInfo: builder.query<any, string>({
      query: (seriesId) => `/api/public/series/${seriesId}`,
      providesTags: (result, error, seriesId) => [
        { type: 'Series', id: seriesId },
      ],
    }),
    
    // Live TV endpoints (placeholders for future implementation)
    getLiveTVChannels: builder.query<any, void>({
      query: () => '/live-tv/channels',
      providesTags: ['LiveTV'],
    }),
    
    // Search endpoint (placeholder for future implementation)
    search: builder.query<any, { query: string; type?: string }>({
      query: ({ query, type }) => ({
        url: '/search',
        params: { q: query, type },
      }),
      providesTags: ['Search'],
    }),
    
    // VOD Categories endpoint
    getVODCategories: builder.query<VODCategoriesResponse, void>({
      query: () => '/api/public/categories/VOD',
      providesTags: ['VODCategories'],
    }),
    
    // Series Categories endpoint
    getSeriesCategories: builder.query<SeriesCategoriesResponse, void>({
      query: () => '/api/public/categories/Series',
      providesTags: ['SeriesCategories'],
    }),
    
    // Live TV Categories endpoint
    getLiveTvCategories: builder.query<LiveTvCategoriesResponse, void>({
      query: () => '/api/public/categories/Live',
      providesTags: ['LiveTvCategories'],
    }),
    
    // Live TV Channels endpoint
    getLiveTvChannels: builder.query<LiveTvResponse, { page: number; limit: number; search?: string; category_id?: string | null }>({
      query: ({ page, limit, search, category_id }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        
        if (search) {
          params.append('search', search);
        }
        
        if (category_id) {
          params.append('category_id', category_id);
        }
        
        return `/api/public/lives?${params.toString()}`;
      },
      providesTags: ['LiveTvChannels'],
    }),
    
    // EPG endpoint
    getEpg: builder.query<EpgResponse, { stream_id: string }>({
      query: ({ stream_id }) => `/api/public/epg/${stream_id}`,
      providesTags: ['Epg'],
    }),
    
    // Movies endpoint with pagination and filters
    getMovies: builder.query<MoviesResponse, { page: number; limit: number; search?: string; category_id?: string | null }>({
      query: ({ page, limit, search, category_id }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          search: search || '',
          category_id: category_id || '',
        });
        return `/api/vods/public?${params.toString()}`;
      },
      providesTags: ['MoviesList'],
    }),
    
    // Sections endpoint
    getSections: builder.query<SectionsResponse, void>({
      query: () => '/api/public/sections',
      providesTags: ['Sections'],
    }),
    
    // Series Sections endpoint
    getSeriesSections: builder.query<SeriesSectionsResponse, void>({
      query: () => '/api/public/sections/series',
      providesTags: ['SeriesSections'],
    }),
    
    // Live TV Sections endpoint
    getLiveTvSections: builder.query<LiveTvSectionsResponse, void>({
      query: () => '/api/public/sections/live-tv',
      providesTags: ['LiveTvSections'],
    }),
    
    // Stream URL endpoint
    getStreamUrl: builder.query<{ success: boolean; data: { streamUrl: string } }, { providerId: string; streamId: string }>({
      query: ({ providerId, streamId }) => `/api/public/stream-url/${providerId}/${streamId}`,
      providesTags: ['StreamUrl'],
    }),
    
    // Series Episode Stream URL endpoint
        getSeriesEpisodeStreamUrl: builder.query<{ success: boolean; data: { streamUrl: string } }, { providerId: string; episodeId: string }>({
          query: ({ providerId, episodeId }) => `/api/public/series-episode-url/${providerId}/${episodeId}`,
          providesTags: ['SeriesEpisodeStreamUrl'],
        }),
        getLiveTvStreamUrl: builder.query<{ success: boolean; streamUrl: string; type: string }, { providerId: string; streamId: string }>({
          query: ({ providerId, streamId }) => `/api/public/livestreamurl/${providerId}/${streamId}`,
          providesTags: ['LiveTvStreamUrl'],
        }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetHeroCarouselQuery,
  useGetMovieDetailsQuery,
  useGetMoviesQuery,
  useGetMovieDetailsByIdQuery,
  useGetSeriesQuery,
  useGetSeriesDetailsQuery,
  useGetSeriesInfoQuery,
  useGetLiveTVChannelsQuery,
  useSearchQuery,
  useGetVODCategoriesQuery,
  useGetSeriesCategoriesQuery,
  useGetLiveTvCategoriesQuery,
  useGetLiveTvChannelsQuery,
  useGetEpgQuery,
  useGetSectionsQuery,
  useGetSeriesSectionsQuery,
  useGetLiveTvSectionsQuery,
  useGetStreamUrlQuery,
  useGetSeriesEpisodeStreamUrlQuery,
  useGetLiveTvStreamUrlQuery,
} = apiSlice;
