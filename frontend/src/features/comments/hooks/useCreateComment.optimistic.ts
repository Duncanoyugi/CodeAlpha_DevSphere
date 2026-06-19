import { useMutation, useQueryClient } from '@tanstack/react-query'
import { commentsApi } from '../../../api/comments.api'
import type { Comment } from '../../../types/comment.types'
import { useToast } from '../../../components/ui/use-toast'

export function useCreateCommentOptimistic() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (vars: { postId: string; content: string; parentId?: string }) =>
      commentsApi.createComment({ postId: vars.postId, content: vars.content, parentId: vars.parentId }),


    onMutate: async (vars: { postId: string; content: string; parentId?: string }) => {

      await queryClient.cancelQueries({ queryKey: ['comments', vars.postId] })

      const prev = queryClient.getQueryData<Comment[]>(['comments', vars.postId])

      const optimistic: Comment & { pending?: boolean } = {
        id: `optimistic-${Date.now()}`,
        postId: vars.postId,
        userId: 'optimistic',
        content: vars.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pending: true,
      } as any

      queryClient.setQueryData<Comment[]>(['comments', vars.postId], (old: Comment[] | undefined) => {
        const list = old ?? []
        return [optimistic as any, ...list]
      })

      queryClient.setQueriesData<Array<{ posts?: Array<{ id?: string; commentsCount?: number }> }>>({ queryKey: ['feed'] }, (old) => {
        if (!old) return old
        return old.map((page) => ({
          ...page,
          posts: page.posts?.map((post) => post.id === vars.postId
            ? { ...post, commentsCount: (post.commentsCount ?? 0) + 1 }
            : post),
        }))
      })

      queryClient.setQueriesData<{ commentsCount?: number }>({ queryKey: ['posts'] }, (old) => {
        if (!old) return old
        return {
          ...old,
          commentsCount: (old.commentsCount ?? 0) + 1,
        }
      })

      return { prev }
    },

    onError: (error: unknown, _vars: { postId: string; content: string; parentId?: string }, ctx: { prev?: Comment[] } | undefined) => {

      if (ctx?.prev) queryClient.setQueryData(['comments', _vars.postId], ctx.prev)

      const message =
        (error as any)?.response?.data?.message ||
        (error instanceof Error ? error.message : 'Failed to create comment')

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })
}

