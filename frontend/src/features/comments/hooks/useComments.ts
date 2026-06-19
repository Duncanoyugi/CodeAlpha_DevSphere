import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { commentsApi } from '../../../api/comments.api'
import { useToast } from '../../../components/ui/use-toast'
import type { Comment } from '../../../types/comment.types'

export function useComments(postId: string) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentsApi.getComments(postId) as Promise<Comment[]>,
    enabled: !!postId,
  })
}

export function useCreateComment() {

  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: commentsApi.createComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] })
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast({
        title: 'Comment added',
        description: 'Your comment has been posted.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add comment',
        variant: 'destructive',
      })
    },
  })
}

export function useDeleteComment() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ commentId }: { commentId: string; postId: string }) => commentsApi.deleteComment(commentId),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] })
      await queryClient.cancelQueries({ queryKey: ['feed'] })
      await queryClient.cancelQueries({ queryKey: ['profile'] })

      queryClient.setQueriesData<{ commentsCount?: number }>({ queryKey: ['posts'] }, (old) => {
        if (!old) return old
        return {
          ...old,
          commentsCount: Math.max(0, (old.commentsCount ?? 0) - 1),
        }
      })

      queryClient.setQueriesData<Array<{ posts?: Array<{ id?: string; commentsCount?: number }> }>>({ queryKey: ['feed'] }, (old) => {
        if (!old) return old
        return old.map((page) => ({
          ...page,
          posts: page.posts?.map((post) => post.id === variables.postId
            ? { ...post, commentsCount: Math.max(0, (post.commentsCount ?? 0) - 1) }
            : post),
        }))
      })

      return { postId: variables.postId }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] })
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast({
        title: 'Comment deleted',
        description: 'Your comment has been removed.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete comment',
        variant: 'destructive',
      })
    },
  })
}