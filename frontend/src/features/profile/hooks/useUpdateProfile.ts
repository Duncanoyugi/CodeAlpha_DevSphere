import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../../../api/users.api'
import { useToast } from '../../../components/ui/use-toast'
import type { UpdateProfileInput } from '../../../types'

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => usersApi.updateProfile(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['profile', 'username', data.username] })
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update profile',
        variant: 'destructive',
      })
    },
  })
}