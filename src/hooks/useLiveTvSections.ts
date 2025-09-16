import { useGetLiveTvSectionsQuery } from '../store/api/apiSlice';

export const useLiveTvSections = () => {
  const {
    data: liveTvSectionsResponse,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetLiveTvSectionsQuery();

  return {
    data: liveTvSectionsResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  };
};
