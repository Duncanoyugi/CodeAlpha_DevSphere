import { useInfiniteQuery } from '@tanstack/react-query'
import { postsApi } from '../../../api/posts.api'

export function useFeed(limit: number = 20) {
  return useInfiniteQuery({
    queryKey: ['feed', 'home'],
    queryFn: ({ pageParam }) => postsApi.getFeed({ limit, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
    staleTime: 2 * 60 * 1000,
    enabled: true,
  })
}

export function useTrendingFeed(limit: number = 20) {
  return useInfiniteQuery({
    queryKey: ['feed', 'trending'],
    queryFn: ({ pageParam }) => postsApi.getTrending({ limit, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
    staleTime: 2 * 60 * 1000,
    enabled: true,
  })
}