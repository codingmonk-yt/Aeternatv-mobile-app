import { useEffect, useState } from 'react';
import { useGetSeriesQuery } from '../store/api/apiSlice';

interface UseSeriesParams {
  search?: string;
  categoryId?: string | null;
  limit?: number;
}

export const useSeries = ({ search, categoryId, limit = 20 }: UseSeriesParams) => {
  const [allSeries, setAllSeries] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEndReached, setIsEndReached] = useState(false);

  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetSeriesQuery({
    page: currentPage,
    limit,
    search: search || undefined,
    category_id: categoryId,
  });

  // Reset state when search or categoryId changes
  useEffect(() => {
    setAllSeries([]);
    setCurrentPage(1);
    setIsEndReached(false);
  }, [search, categoryId]);

  // Update allSeries when new data arrives
  useEffect(() => {
    if (data?.series) {
      if (currentPage === 1) {
        setAllSeries(data.series);
      } else {
        setAllSeries(prev => [...prev, ...data.series]);
      }
      
      // Check if we've reached the end
      if (data.pagination.currentPage >= data.pagination.totalPages) {
        setIsEndReached(true);
      }
    }
  }, [data, currentPage]);

  const loadMore = () => {
    if (!isFetching && !isEndReached && data?.pagination.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const hasNextPage = data?.pagination.hasNextPage || false;

  return {
    series: allSeries,
    pagination: data?.pagination,
    isLoading,
    isFetching,
    error,
    hasNextPage,
    loadMore,
    refetch,
    isEndReached,
  };
};
