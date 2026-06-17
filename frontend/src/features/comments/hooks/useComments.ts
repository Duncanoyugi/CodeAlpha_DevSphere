import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { commentsApi } from '../../../api/comments.api'
import { useToast } from '../../../components/ui/use-toast'

export function useComments(postId: string) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentsApi.getComments(postId),
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
    mutationFn: commentsApi.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
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