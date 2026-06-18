import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bookmarksApi } from '../../../api/bookmarks.api'
import type { Post } from '../../../types'

export function useToggleBookmark() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => bookmarksApi.toggleBookmark(postId),
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ['feed', 'home'] })
      await queryClient.cancelQueries({ queryKey: ['feed', 'trending'] })
      await queryClient.cancelQueries({ queryKey: ['bookmarks'] })
      await queryClient.cancelQueries({ queryKey: ['posts', postId] })

      const prevFeed = queryClient.getQueryData<any>(['feed', 'home'])
      const prevTrending = queryClient.getQueryData<any>(['feed', 'trending'])
      const prevSaved = queryClient.getQueryData<any>(['bookmarks'])
      const prevPost = queryClient.getQueryData<Post>(['posts', postId])

      const updatePost = (post: Post) => {
        if (post.id !== postId) return post
        const bookmarked = !!post.bookmarked
        return {
          ...post,
          bookmarked: !bookmarked,
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

      queryClient.setQueryData<any>(['bookmarks'], (old: any) => {
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
        const bookmarked = !!old.bookmarked
        return {
          ...old,
          bookmarked: !bookmarked,
        }
      })

      return { prevFeed, prevTrending, prevSaved, prevPost }
    },
    onError: (_err, postId, ctx) => {
      if (!ctx) return
      queryClient.setQueryData(['feed', 'home'], ctx.prevFeed)
      queryClient.setQueryData(['feed', 'trending'], ctx.prevTrending)
      queryClient.setQueryData(['bookmarks'], ctx.prevSaved)
      queryClient.setQueryData(['posts', postId], ctx.prevPost)
    },
    onSettled: (_data, _error, postId) => {
      queryClient.invalidateQueries({ queryKey: ['feed', 'home'] })
      queryClient.invalidateQueries({ queryKey: ['feed', 'trending'] })
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
      queryClient.invalidateQueries({ queryKey: ['posts', postId] })
    },
  })
}