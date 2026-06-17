import { useMutation, useQueryClient } from '@tanstack/react-query'
import { commentsApi } from '../../../api/comments.api'
import type { Comment } from '../../../types/comment.types'
import { useToast } from '../../../components/ui/use-toast'

export function useCreateCommentOptimistic() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (vars: { postId: string; content: string }) =>
      commentsApi.createComment({ postId: vars.postId, content: vars.content }),

    onMutate: async (vars: { postId: string; content: string }) => {
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

      return { prev }
    },

    onError: (error: unknown, _vars: { postId: string; content: string }, ctx: { prev?: Comment[] } | undefined) => {
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

