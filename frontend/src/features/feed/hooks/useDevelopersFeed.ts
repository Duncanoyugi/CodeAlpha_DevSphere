import { useInfiniteQuery } from '@tanstack/react-query'
import { postsApi } from '../../../api/posts.api'

export function useDevelopersFeed(limit: number = 20) {
  return useInfiniteQuery({
    queryKey: ['feed', 'developers'],
    queryFn: ({ pageParam }) => postsApi.getDevelopers({ limit, cursor: pageParam as string | undefined }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as unknown,
    staleTime: 2 * 60 * 1000,
  })
}