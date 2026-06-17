import { useMutation, useQueryClient } from '@tanstack/react-query'
import { likesApi } from '../../../api/likes.api'
import type { Post } from '../../../types'

export function useUnlikePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => likesApi.unlikePost(postId),
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ['feed', 'home'] })
      await queryClient.cancelQueries({ queryKey: ['posts', postId] })

      const prevFeed = queryClient.getQueryData<any>(['feed', 'home'])
      const prevPost = queryClient.getQueryData<Post>(['posts', postId])

      queryClient.setQueryData<any>(['feed', 'home'], (old: any) => {
        if (!old?.pages) return old
        return {
          ...old,
          pages: old.pages.map((p: any) => ({
            ...p,
            posts: (p.posts as Post[]).map((post) => {
              if (post.id !== postId) return post
              return {
                ...post,
                isLiked: false,
                likes: Array.isArray(post.likes) ? post.likes.slice(0, Math.max(0, post.likes.length - 1)) : post.likes,
              }
            }),
          })),
        }
      })

      queryClient.setQueryData<Post>(['posts', postId], (old) => {
        if (!old) return old
        return {
          ...old,
          isLiked: false,
          likes: Array.isArray(old.likes) ? old.likes.slice(0, Math.max(0, old.likes.length - 1)) : old.likes,
        }
      })

      return { prevFeed, prevPost }
    },
    onError: (_err, postId, ctx) => {
      if (!ctx) return
      queryClient.setQueryData(['feed', 'home'], ctx.prevFeed)
      queryClient.setQueryData(['posts', postId], ctx.prevPost)
    },
    onSettled: (_data, _error, postId) => {
      queryClient.invalidateQueries({ queryKey: ['feed', 'home'] })
      queryClient.invalidateQueries({ queryKey: ['posts', postId] })
    },
  })
}

