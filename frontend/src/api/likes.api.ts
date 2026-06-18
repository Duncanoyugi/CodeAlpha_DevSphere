import api from './client'
import type { Post } from '../types'

export const likesApi = {
  likePost: async (postId: string): Promise<Post> => {
    const { data } = await api.post<Post>(`/likes/${postId}`)
    return data
  },

  unlikePost: async (postId: string): Promise<void> => {
    await api.delete(`/likes/${postId}`)
  },

  getPostLikes: async (postId: string): Promise<Array<{ userId: string }>> => {
    const { data } = await api.get(`/likes/${postId}`)
    return data
  },

  hasLiked: async (postId: string): Promise<{ hasLiked: boolean }> => {
    const { data } = await api.get<{ hasLiked: boolean }>(`/likes/check/${postId}`)
    return data
  },
}

