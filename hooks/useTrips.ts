import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Trip } from "../types";
import { tripApi } from "../services/api/tripApi";

const limit = 50;

// Custom debounce hook
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useTrips = (selectedRouteIds: string[] = []) => {
  // Debounce route changes by 500ms
  const debouncedRouteIds = useDebounce(selectedRouteIds, 500);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "trips",
      [...debouncedRouteIds].sort((a, b) => a.localeCompare(b)).join(","),
    ],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await tripApi.getTrips(
        pageParam,
        limit,
        debouncedRouteIds,
      );
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined;
      return allPages.length * limit;
    },
    initialPageParam: 0,
    enabled: debouncedRouteIds.length > 0, // Only fetch when routes are selected
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Deduplicate trips by ID across all pages
  const trips = data?.pages.flat() || [];
  const uniqueTrips = trips.reduce<Trip[]>((acc, trip) => {
    if (!acc.some((t) => t.id === trip.id)) {
      acc.push(trip);
    }
    return acc;
  }, []);

  // Load more with increment delay (1+n pattern)
  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      const pageCount = data?.pages.length || 0;
      const delay = 100 + pageCount * 50; // 100ms base + 50ms per page

      setTimeout(() => {
        fetchNextPage();
      }, delay);
    }
  };

  return {
    trips: uniqueTrips,
    loading: isLoading,
    fetching: isFetchingNextPage,
    error: error || null,
    hasMore: hasNextPage ?? false,
    loadMore,
  };
};
