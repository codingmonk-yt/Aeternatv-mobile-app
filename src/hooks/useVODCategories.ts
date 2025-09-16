import { useGetVODCategoriesQuery } from '../store/api/apiSlice';

export const useVODCategories = () => {
  const {
    data: categoriesResponse,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetVODCategoriesQuery();

  return {
    categories: categoriesResponse?.data || [],
    error,
    isLoading,
    isFetching,
    refetch,
    hasData: !!categoriesResponse?.data?.length,
  };
};
