import { useInfiniteQuery } from '@tanstack/react-query';
import { Route } from '../types';
import { routeApi } from '../services/api/routeApi';

const limit = 20;

export const useRoutes = () => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['routes'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await routeApi.getRoutes(pageParam, limit);
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined;
      return allPages.length * limit;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const routes = data?.pages.flatMap(page => page) || [];

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return {
    routes,
    loading: isLoading,
    error: error as Error | null,
    hasMore: hasNextPage,
    loadMore
  };
};