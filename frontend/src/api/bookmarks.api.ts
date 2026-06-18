import api from './client'
import type { Post } from '../types'

export const bookmarksApi = {
  getBookmarks: async (limit?: number, cursor?: string): Promise<{ posts: Post[]; nextCursor?: string | null }> => {
    const { data } = await api.get('/profile/bookmarks', { params: { limit, cursor } })
    return data
  },

  toggleBookmark: async (postId: string): Promise<{ bookmarked: boolean }> => {
    const { data } = await api.post(`/posts/${postId}/bookmark`)
    return data
  },
}