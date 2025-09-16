import { useGetSeriesSectionsQuery } from '../store/api/apiSlice';

export const useSeriesSections = () => {
  const {
    data: seriesSectionsResponse,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetSeriesSectionsQuery();

  return {
    data: seriesSectionsResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  };
};
