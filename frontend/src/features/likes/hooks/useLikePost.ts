import { useMutation, useQueryClient } from '@tanstack/react-query'
import { likesApi } from '../../../api/likes.api'
import type { Post } from '../../../types'

export function useLikePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => likesApi.likePost(postId),
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ['feed', 'home'] })
      await queryClient.cancelQueries({ queryKey: ['posts', postId] })

      const prevFeed = queryClient.getQueryData<any>(['feed', 'home'])
      const prevPost = queryClient.getQueryData<Post>(['posts', postId])

      // Optimistically flip UI
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
                isLiked: true,
                likes: Array.isArray(post.likes)
                  ? post.likes.concat('optimistic')
                  : post.likes,
              }
            }),
          })),
        }
      })

      queryClient.setQueryData<Post>(['posts', postId], (old) => {
        if (!old) return old
        return {
          ...old,
          isLiked: true,
          likes: Array.isArray(old.likes)
            ? old.likes.concat('optimistic')
            : old.likes,
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

