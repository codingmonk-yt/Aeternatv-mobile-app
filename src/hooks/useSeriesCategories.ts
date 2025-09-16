import { useGetSeriesCategoriesQuery } from '../store/api/apiSlice';

export const useSeriesCategories = () => {
  const { data, error, isLoading } = useGetSeriesCategoriesQuery();

  return {
    categories: data?.data || [],
    isLoading,
    error,
  };
};
