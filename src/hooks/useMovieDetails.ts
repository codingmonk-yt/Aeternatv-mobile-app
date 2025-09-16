import { useGetMovieDetailsQuery } from '../store/api/apiSlice';

export const useMovieDetails = (movieId: string) => {
  // Debug logging
  console.log('=== useMovieDetails Hook Debug ===');
  console.log('movieId received:', movieId);
  console.log('movieId type:', typeof movieId);
  console.log('movieId truthy:', !!movieId);
  console.log('==================================');

  const {
    data: movieDetailsResponse,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useGetMovieDetailsQuery(movieId, {
    skip: !movieId, // Skip query if no movieId provided
  });

  // More debug logging
  console.log('=== useMovieDetails Response Debug ===');
  console.log('isLoading:', isLoading);
  console.log('isFetching:', isFetching);
  console.log('error:', error);
  console.log('movieDetailsResponse:', movieDetailsResponse);
  console.log('=====================================');

  return {
    movieDetails: movieDetailsResponse?.data,
    similarMovies: movieDetailsResponse?.similarMovies || [],
    isLoading,
    isFetching,
    error,
    refetch,
  };
};
