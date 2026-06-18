import { useInfiniteQuery } from '@tanstack/react-query'
import { bookmarksApi } from '../../../api/bookmarks.api'

export function useSavedPosts(limit: number = 20) {
  return useInfiniteQuery({
    queryKey: ['bookmarks'],
    queryFn: ({ pageParam }: { pageParam: unknown }) => bookmarksApi.getBookmarks(limit, pageParam as string | undefined),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as unknown,
    staleTime: 2 * 60 * 1000,
  })
}