import { useQuery } from '@tanstack/react-query'
import { postsApi } from '../../../api/posts.api'

export function usePostsByTag(tag: string) {
  return useQuery({
    queryKey: ['technologies', 'posts', tag],
    queryFn: () => postsApi.getPostsByTag(tag),
    enabled: !!tag,
  })
}