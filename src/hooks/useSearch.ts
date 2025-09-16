import { useState } from 'react';
import { useSearchQuery } from '../store/api/apiSlice';

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'Movie' | 'Series' | 'Live TV' | undefined>();

  const {
    data: searchResults,
    isLoading,
    error,
    refetch,
  } = useSearchQuery(
    { query: searchQuery, type: searchType },
    {
      skip: searchQuery.length < 2, // Only search when query is at least 2 characters
    }
  );

  const handleSearch = (query: string, type?: 'Movie' | 'Series' | 'Live TV') => {
    setSearchQuery(query);
    setSearchType(type);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchType(undefined);
  };

  return {
    searchQuery,
    searchType,
    searchResults,
    isLoading,
    error,
    refetch,
    handleSearch,
    clearSearch,
  };
};
