import { useQuery } from '@tanstack/react-query';
import { Vehicle } from '../types';
import { vehicleApi } from '../services/api/vehicleApi';

interface UseVehiclesReturn {
  data: Vehicle[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

const CACHE_DURATION = 60 * 1000; // 60 seconds

export const useVehicles = (): UseVehiclesReturn => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const result = await vehicleApi.getVehicles();
      return result.data;
    },
    staleTime: CACHE_DURATION,
    gcTime: CACHE_DURATION,
    refetchOnWindowFocus: false,
  });

  return {
    data: data || [],
    loading: isLoading,
    error: error as Error | null,
    refetch
  };
};