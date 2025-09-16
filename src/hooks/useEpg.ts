import { useGetEpgQuery } from '../store/api/apiSlice';

interface UseEpgParams {
  streamId: string;
  enabled?: boolean;
}

export const useEpg = ({ streamId, enabled = true }: UseEpgParams) => {
  const {
    data: epgResponse,
    isLoading,
    error,
    refetch,
  } = useGetEpgQuery(
    { stream_id: streamId },
    { skip: !enabled || !streamId }
  );

  const epgListings = epgResponse?.data?.epg_data?.epg_listings || [];
  const providerName = epgResponse?.data?.provider_name || '';

  return {
    epgListings,
    providerName,
    isLoading,
    error,
    refetch,
  };
};
