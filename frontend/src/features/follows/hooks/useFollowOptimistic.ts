import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { followsApi } from '../../../api/follows.api'
import { useToast } from '../../../components/ui/use-toast'

type Ctx = {
  prevCheck: { isFollowing: boolean } | undefined
  prevCounts: { followers: number; following: number } | undefined
}


export function useFollowOptimistic() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (userId: string) => followsApi.followUser(userId),
    onMutate: async (userId: string): Promise<Ctx> => {
      await queryClient.cancelQueries({ queryKey: ['follows', 'check', userId] })
      await queryClient.cancelQueries({ queryKey: ['follows', 'counts', userId] })

      const prevCheck = queryClient.getQueryData<{ isFollowing: boolean }>(['follows', 'check', userId])
      const prevCounts = queryClient.getQueryData<{ followers: number; following: number }>([
        'follows',
        'counts',
        userId,
      ])

      queryClient.setQueryData(['follows', 'check', userId], { isFollowing: true })

      if (prevCounts) {
        queryClient.setQueryData(['follows', 'counts', userId], {
          ...prevCounts,
          followers: prevCounts.followers + 1,
        })
      }

      return { prevCheck, prevCounts }
    },
    onError: (error: AxiosError<any> | unknown, userId: string, ctx) => {
      if (!ctx) return
      queryClient.setQueryData(['follows', 'check', userId], ctx.prevCheck)
      if (ctx.prevCounts) queryClient.setQueryData(['follows', 'counts', userId], ctx.prevCounts)

      const message =
        (error as AxiosError<any>)?.response?.data?.message ||
        (error as Error)?.message ||
        'Failed to follow user'

      toast({ title: 'Error', description: message, variant: 'destructive' })
    },
    onSettled: (_data, _error, userId) => {
      queryClient.invalidateQueries({ queryKey: ['follows', 'check', userId] })
      queryClient.invalidateQueries({ queryKey: ['follows', 'counts', userId] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onSuccess: () => {
      toast({ title: 'Following', description: 'You are now following this user.' })
    },
  })
}

export function useUnfollowOptimistic() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (userId: string) => followsApi.unfollowUser(userId),
    onMutate: async (userId: string): Promise<Ctx> => {
      await queryClient.cancelQueries({ queryKey: ['follows', 'check', userId] })
      await queryClient.cancelQueries({ queryKey: ['follows', 'counts', userId] })

      const prevCheck = queryClient.getQueryData<{ isFollowing: boolean }>(['follows', 'check', userId])
      const prevCounts = queryClient.getQueryData<{ followers: number; following: number }>([
        'follows',
        'counts',
        userId,
      ])

      queryClient.setQueryData(['follows', 'check', userId], { isFollowing: false })

      if (prevCounts) {
        queryClient.setQueryData(['follows', 'counts', userId], {
          ...prevCounts,
          followers: Math.max(0, prevCounts.followers - 1),
        })
      }

      return { prevCheck, prevCounts }
    },
    onError: (error: AxiosError<any> | unknown, userId: string, ctx) => {
      if (!ctx) return
      queryClient.setQueryData(['follows', 'check', userId], ctx.prevCheck)
      if (ctx.prevCounts) queryClient.setQueryData(['follows', 'counts', userId], ctx.prevCounts)

      const message =
        (error as AxiosError<any>)?.response?.data?.message ||
        (error as Error)?.message ||
        'Failed to unfollow user'

      toast({ title: 'Error', description: message, variant: 'destructive' })
    },
    onSettled: (_data, _error, userId) => {
      queryClient.invalidateQueries({ queryKey: ['follows', 'check', userId] })
      queryClient.invalidateQueries({ queryKey: ['follows', 'counts', userId] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onSuccess: () => {
      toast({ title: 'Unfollowed', description: 'You have unfollowed this user.' })
    },
  })
}

