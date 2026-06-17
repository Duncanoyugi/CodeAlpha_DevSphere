import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../../../api/users.api'
import { useToast } from '../../../components/ui/use-toast'

export function useSkills(userId?: string) {
  return useQuery({
    queryKey: ['skills', userId || 'me'],
    queryFn: () => usersApi.getSkills(userId),
    enabled: true,
  })
}

export function useAddSkill() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ skill, level }: { skill: string; level: string }) =>
      usersApi.addSkill(skill, level),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
      toast({
        title: 'Skill added',
        description: 'Technology has been added to your profile.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add skill',
        variant: 'destructive',
      })
    },
  })
}

export function useUpdateSkill() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ skillId, level }: { skillId: string; level: string }) =>
      usersApi.updateSkill(skillId, level),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
      toast({
        title: 'Skill updated',
        description: 'Skill level has been updated.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update skill',
        variant: 'destructive',
      })
    },
  })
}

export function useRemoveSkill() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (skillId: string) => usersApi.removeSkill(skillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
      toast({
        title: 'Skill removed',
        description: 'Technology has been removed from your profile.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to remove skill',
        variant: 'destructive',
      })
    },
  })
}