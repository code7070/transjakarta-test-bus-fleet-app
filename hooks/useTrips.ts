import { useState, useEffect, useCallback } from "react";
import { Trip } from "../types";
import { tripApi } from "../services/api/tripApi";

export const useTrips = (selectedRouteIds: string[] = []) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  const fetchTrips = useCallback(
    async (isLoadMore = false, signal?: AbortSignal) => {
      // MBTA API Requirement: At least one filter is required for /trips
      if (!selectedRouteIds || selectedRouteIds.length === 0) {
        setTrips([]);
        setHasMore(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const currentOffset = isLoadMore ? offset : 0;
        const response = await tripApi.getTrips(
          currentOffset,
          limit,
          selectedRouteIds,
          signal,
        );

        const newTrips = response.data || [];

        setTrips((prev) => {
          if (!isLoadMore) return newTrips;

          // Deduplicate by ID
          const existingIds = new Set(prev.map((t) => t.id));
          const filteredNewTrips = newTrips.filter(
            (t) => !existingIds.has(t.id),
          );
          return [...prev, ...filteredNewTrips];
        });

        setOffset((prev) => (isLoadMore ? prev + limit : limit));
        setHasMore(newTrips.length === limit);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    },
    [offset, limit, selectedRouteIds],
  );

  // Reset and refetch when selected routes change
  useEffect(() => {
    const controller = new AbortController();

    // Clear and fetch
    setOffset(0);
    setHasMore(true);
    setTrips([]);
    fetchTrips(false, controller.signal);

    return () => {
      controller.abort();
    };
  }, [selectedRouteIds.join(",")]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchTrips(true);
    }
  }, [hasMore, loading, fetchTrips]);

  return { trips, loading, error, hasMore, loadMore };
};
