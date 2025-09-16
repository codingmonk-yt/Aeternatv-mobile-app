import { useCallback, useEffect, useState } from 'react';
import { useGetLiveTvChannelsQuery } from '../store/api/apiSlice';

interface UseLiveTvParams {
  search?: string;
  categoryId?: string | null;
  limit?: number;
}

export const useLiveTv = ({ search, categoryId, limit = 20 }: UseLiveTvParams) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allChannels, setAllChannels] = useState<any[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isEndReached, setIsEndReached] = useState(false);

  const {
    data: liveTvResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetLiveTvChannelsQuery({
    page: currentPage,
    limit,
    search: search || undefined,
    category_id: categoryId || undefined,
  });

  // Reset data when search or category changes
  useEffect(() => {
    setAllChannels([]);
    setCurrentPage(1);
    setHasNextPage(true);
    setIsEndReached(false);
  }, [search, categoryId]);

  // Update channels when new data arrives
  useEffect(() => {
    if (liveTvResponse) {
      if (currentPage === 1) {
        // First page - replace all data
        setAllChannels(liveTvResponse.streams);
      } else {
        // Subsequent pages - append data
        setAllChannels(prev => [...prev, ...liveTvResponse.streams]);
      }
      
      setHasNextPage(liveTvResponse.pagination.hasNextPage);
      setIsEndReached(!liveTvResponse.pagination.hasNextPage);
    }
  }, [liveTvResponse, currentPage]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetching && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasNextPage, isFetching, isLoading]);

  const reset = useCallback(() => {
    setAllChannels([]);
    setCurrentPage(1);
    setHasNextPage(true);
    setIsEndReached(false);
  }, []);

  return {
    channels: allChannels,
    pagination: liveTvResponse?.pagination,
    isLoading: isLoading && currentPage === 1,
    isFetching,
    error,
    hasNextPage,
    loadMore,
    refetch,
    isEndReached,
    reset,
  };
};
