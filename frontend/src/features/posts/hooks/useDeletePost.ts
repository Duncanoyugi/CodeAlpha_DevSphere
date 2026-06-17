import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { postsApi } from '../../../api/posts.api'
import { useToast } from '../../../components/ui/use-toast'

export function useDeletePost() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (id: string) => postsApi.deletePost(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['posts', id] })
      toast({
        title: 'Post deleted',
        description: 'Your post has been removed.',
      })
      navigate('/feed')
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete post',
        variant: 'destructive',
      })
    },
  })
}