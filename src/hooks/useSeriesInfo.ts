import { useGetSeriesInfoQuery } from '../store/api/apiSlice';

export const useSeriesInfo = (seriesId: string | null) => {
  const { data, error, isLoading } = useGetSeriesInfoQuery(seriesId!, {
    skip: !seriesId,
  });

  return {
    seriesInfo: data,
    isLoading,
    error,
  };
};
