import { useGetSectionsQuery } from '../store/api/apiSlice';

export const useSections = () => {
  const {
    data: sectionsResponse,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetSectionsQuery();

  return {
    sections: sectionsResponse?.data || [],
    isLoading,
    isFetching,
    error,
    refetch,
  };
};

