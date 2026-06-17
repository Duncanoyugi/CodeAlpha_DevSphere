import { useQuery } from '@tanstack/react-query'
import { postsApi } from '../../../api/posts.api'

export function usePost(id: string) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => postsApi.getPost(id),
    enabled: !!id,
  })
}

export function useUserPosts(userId: string) {
  return useQuery({
    queryKey: ['posts', 'user', userId],
    queryFn: () => postsApi.getUserPosts(userId),
    enabled: !!userId,
  })
}

export function usePostsByTag(tag: string) {
  return useQuery({
    queryKey: ['posts', 'tag', tag],
    queryFn: () => postsApi.getPostsByTag(tag),
    enabled: !!tag,
  })
}

export function useTrendingPosts(limit: number = 20) {
  return useQuery({
    queryKey: ['posts', 'trending'],
    queryFn: () => postsApi.getTrending(limit),
  })
}