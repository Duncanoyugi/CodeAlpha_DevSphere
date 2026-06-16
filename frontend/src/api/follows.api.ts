import api from './client'
import type { Follow } from '../types'

export const followsApi = {
  followUser: async (userId: string) => {
    const { data } = await api.post<Follow>(`/follows/${userId}`)
    return data
  },

  unfollowUser: async (userId: string) => {
    await api.delete(`/follows/${userId}`)
  },

  getFollowers: async (userId: string) => {
    const { data } = await api.get<Follow[]>(`/follows/followers/${userId}`)
    return data
  },

  getFollowing: async (userId: string) => {
    const { data } = await api.get<Follow[]>(`/follows/following/${userId}`)
    return data
  },

  isFollowing: async (userId: string) => {
    const { data } = await api.get<{ isFollowing: boolean }>(`/follows/check/${userId}`)
    return data
  },

  getFollowCounts: async (userId: string) => {
    const { data } = await api.get<{ followers: number; following: number }>(`/follows/counts/${userId}`)
    return data
  },
}