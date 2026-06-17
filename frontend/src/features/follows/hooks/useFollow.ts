import { useQuery } from '@tanstack/react-query'
import { useFollowOptimistic, useUnfollowOptimistic } from './useFollowOptimistic'
import { followsApi } from '../../../api/follows.api'

export function useFollow() {
  return useFollowOptimistic()
}

export function useUnfollow() {
  return useUnfollowOptimistic()
}

export function useIsFollowing(userId: string) {
  return useQuery({
    queryKey: ['follows', 'check', userId],
    queryFn: () => followsApi.isFollowing(userId),
    enabled: !!userId,
  })
}

export function useFollowCounts(userId: string) {
  return useQuery({
    queryKey: ['follows', 'counts', userId],
    queryFn: () => followsApi.getFollowCounts(userId),
    enabled: !!userId,
  })
}

export function useFollowers(userId: string) {
  return useQuery({
    queryKey: ['follows', 'followers', userId],
    queryFn: () => followsApi.getFollowers(userId),
    enabled: !!userId,
  })
}

export function useFollowing(userId: string) {
  return useQuery({
    queryKey: ['follows', 'following', userId],
    queryFn: () => followsApi.getFollowing(userId),
    enabled: !!userId,
  })
}

