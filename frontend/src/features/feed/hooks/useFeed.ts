import { useInfiniteQuery } from '@tanstack/react-query'
import { useAppSelector } from '../../../app/hooks'
import { postsApi } from '../../../api/posts.api'

export function useFeed(limit: number = 20) {
  const { hasCheckedAuth } = useAppSelector((state) => state.auth)
  
  return useInfiniteQuery({
    queryKey: ['feed', 'home'],
    queryFn: ({ pageParam }) => postsApi.getFeed({ limit, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
    staleTime: 2 * 60 * 1000,
    enabled: hasCheckedAuth,
  })
}