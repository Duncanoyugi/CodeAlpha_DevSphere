import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { postsApi } from '../../../api/posts.api'
import { useToast } from '../../../components/ui/use-toast'
import type { CreatePostInput } from '../../../types'

export function useCreatePost() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreatePostInput) => postsApi.createPost(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['posts', 'trending'] })
      toast({
        title: 'Post created!',
        description: 'Your post has been published successfully.',
      })
      navigate(`/post/${data.id}`)
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create post',
        variant: 'destructive',
      })
    },
  })
}