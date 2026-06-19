import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postsApi } from '../../../api/posts.api'
import { useToast } from '../../../components/ui/use-toast'
import type { UpdatePostInput } from '../../../types'

export function useUpdatePost() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, ...data }: UpdatePostInput & { id: string }) =>
      postsApi.updatePost({ id, ...data }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts', data.id] })
      queryClient.invalidateQueries({ queryKey: ['posts', 'user', data.authorId] })
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast({
        title: 'Post updated',
        description: 'Your post has been updated successfully.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update post',
        variant: 'destructive',
      })
    },
  })
}