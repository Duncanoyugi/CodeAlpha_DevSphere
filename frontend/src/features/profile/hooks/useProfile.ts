import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../../../api/users.api'
import { useToast } from '../../../components/ui/use-toast'

export function useProfile(username?: string) {
  return useQuery({
    queryKey: username ? ['profile', 'username', username] : ['profile', 'me'],
    queryFn: () => username ? usersApi.getProfileByUsername(username) : usersApi.getMyProfile(),
    enabled: true,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['profile', 'username', data.username] })
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      })
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description: (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update profile',
        variant: 'destructive',
      })
    },
  })
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: usersApi.uploadAvatar,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast({
        title: 'Avatar updated',
        description: 'Your profile picture has been updated.',
      })
      return data
    },
    onError: (error: unknown) => {
      toast({
        title: 'Upload failed',
        description: (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to upload avatar',
        variant: 'destructive',
      })
      throw error
    },
  })
}