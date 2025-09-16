import { useCallback, useEffect, useState } from 'react';
import { useGetMoviesQuery } from '../store/api/apiSlice';
import { MovieStream, MoviesPagination } from '../types';

interface UseMoviesParams {
  search?: string;
  categoryId?: string | null;
  limit?: number;
}

interface UseMoviesReturn {
  movies: MovieStream[];
  pagination: MoviesPagination | null;
  isLoading: boolean;
  isFetching: boolean;
  error: any;
  hasNextPage: boolean;
  loadMore: () => void;
  refetch: () => void;
  isEndReached: boolean;
}

export const useMovies = ({ 
  search = '', 
  categoryId = null, 
  limit = 20 
}: UseMoviesParams = {}): UseMoviesReturn => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allMovies, setAllMovies] = useState<MovieStream[]>([]);
  const [isEndReached, setIsEndReached] = useState(false);

  const {
    data: moviesResponse,
    error,
    isLoading,
    isFetching,
    refetch: refetchQuery,
  } = useGetMoviesQuery({
    page: currentPage,
    limit,
    search: search || undefined,
    category_id: categoryId,
  });

  // Reset movies when search or category changes
  useEffect(() => {
    setAllMovies([]);
    setCurrentPage(1);
    setIsEndReached(false);
  }, [search, categoryId]);

  // Update movies when new data arrives
  useEffect(() => {
    if (moviesResponse) {
      if (currentPage === 1) {
        // First page - replace all movies
        setAllMovies(moviesResponse.streams);
      } else {
        // Subsequent pages - append to existing movies
        setAllMovies(prev => [...prev, ...moviesResponse.streams]);
      }
      
      // Check if we've reached the end
      setIsEndReached(
        moviesResponse.pagination.currentPage >= moviesResponse.pagination.totalPages
      );
    }
  }, [moviesResponse, currentPage]);

  const loadMore = useCallback(() => {
    if (!isFetching && !isEndReached && moviesResponse?.pagination.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [isFetching, isEndReached, moviesResponse?.pagination.hasNextPage]);

  const refetch = useCallback(() => {
    setAllMovies([]);
    setCurrentPage(1);
    setIsEndReached(false);
    refetchQuery();
  }, [refetchQuery]);

  return {
    movies: allMovies,
    pagination: moviesResponse?.pagination || null,
    isLoading: isLoading && currentPage === 1,
    isFetching,
    error,
    hasNextPage: moviesResponse?.pagination.hasNextPage || false,
    loadMore,
    refetch,
    isEndReached,
  };
};