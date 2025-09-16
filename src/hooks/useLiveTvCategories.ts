import { useGetLiveTvCategoriesQuery } from '../store/api/apiSlice';

export const useLiveTvCategories = () => {
  const {
    data: categoriesResponse,
    isLoading,
    error,
    refetch,
  } = useGetLiveTvCategoriesQuery();

  // Filter out blacklisted categories
  const categories = categoriesResponse?.data?.filter(category => !category.blacklisted) || [];

  return {
    categories,
    isLoading,
    error,
    refetch,
  };
};
