import { useMutation, useQueryClient } from '@tanstack/react-query'
import { likesApi } from '../../../api/likes.api'
import type { Post } from '../../../types'

export function useLikePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => likesApi.likePost(postId),
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ['feed', 'home'] })
      await queryClient.cancelQueries({ queryKey: ['feed', 'trending'] })
      await queryClient.cancelQueries({ queryKey: ['posts', postId] })

      const prevFeed = queryClient.getQueryData<any>(['feed', 'home'])
      const prevTrending = queryClient.getQueryData<any>(['feed', 'trending'])
      const prevPost = queryClient.getQueryData<Post>(['posts', postId])

      const updatePost = (post: Post) => {
        if (post.id !== postId) return post
        const likesCount = post.likesCount ?? 0
        return {
          ...post,
          liked: true,
          likesCount: likesCount + 1,
          likes: Array.isArray(post.likes) ? [...post.likes, 'optimistic'] : post.likes,
        }
      }

      queryClient.setQueryData<any>(['feed', 'home'], (old: any) => {
        if (!old?.pages) return old
        return {
          ...old,
          pages: old.pages.map((p: any) => ({
            ...p,
            posts: (p.posts as Post[]).map(updatePost),
          })),
        }
      })

      queryClient.setQueryData<any>(['feed', 'trending'], (old: any) => {
        if (!old?.pages) return old
        return {
          ...old,
          pages: old.pages.map((p: any) => ({
            ...p,
            posts: (p.posts as Post[]).map(updatePost),
          })),
        }
      })

      queryClient.setQueryData<Post>(['posts', postId], (old) => {
        if (!old) return old
        const likesCount = old.likesCount ?? 0
        return {
          ...old,
          liked: true,
          likesCount: likesCount + 1,
          likes: Array.isArray(old.likes) ? [...old.likes, 'optimistic'] : old.likes,
        }
      })

      return { prevFeed, prevTrending, prevPost }
    },
    onError: (_err, postId, ctx) => {
      if (!ctx) return
      queryClient.setQueryData(['feed', 'home'], ctx.prevFeed)
      queryClient.setQueryData(['feed', 'trending'], ctx.prevTrending)
      queryClient.setQueryData(['posts', postId], ctx.prevPost)
    },
    onSettled: (_data, _error, postId) => {
      queryClient.invalidateQueries({ queryKey: ['feed', 'home'] })
      queryClient.invalidateQueries({ queryKey: ['feed', 'trending'] })
      queryClient.invalidateQueries({ queryKey: ['posts', postId] })
    },
  })
}

