import api from './client'

export const repostsApi = {
  toggleRepost: async (postId: string): Promise<{ reposted: boolean }> => {
    const { data } = await api.post<{ reposted: boolean }>(`/reposts/${postId}`)
    return data
  },

  getPostReposts: async (postId: string) => {
    const { data } = await api.get<Array<{ id: string; userId: string; postId: string; createdAt: string; user: { id: string; username: string; avatar: string | null } }>>(`/reposts/${postId}`)
    return data
  },
}
