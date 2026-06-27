import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { repostsApi } from '../../../api/reposts.api'

export function useToggleRepost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => repostsApi.toggleRepost(postId),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['reposts', postId] })
    },
  })
}

export function usePostReposts(postId: string) {
  return useQuery({
    queryKey: ['reposts', postId],
    queryFn: () => repostsApi.getPostReposts(postId),
    enabled: !!postId,
  })
}

export function useHasReposted(postId: string) {
  return useQuery({
    queryKey: ['reposts', 'has', postId],
    queryFn: async () => {
      return { reposted: false }
    },
    enabled: false,
  })
}
