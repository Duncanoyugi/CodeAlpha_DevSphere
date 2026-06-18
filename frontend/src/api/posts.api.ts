import api from './client'
import type { Post, CreatePostInput, UpdatePostInput } from '../types'

export const postsApi = {
  getFeed: async (params?: { limit?: number; cursor?: string }) => {
    const { data } = await api.get('/feed/home', { params })
    return data
  },

  getTrending: async (params?: { limit?: number; cursor?: string }) => {
    const { data } = await api.get('/feed/trending', { params: { limit: params?.limit } })
    return data
  },

  getDevelopers: async (params?: { limit?: number; cursor?: string }) => {
    const { data } = await api.get('/feed/developers', { params })
    return data
  },

  getPost: async (id: string) => {
    const { data } = await api.get<Post>(`/posts/${id}`)
    return data
  },

  createPost: async (input: CreatePostInput) => {
    const { data } = await api.post<Post>('/posts', input)
    return data
  },

  uploadImage: async (file: File): Promise<{ imageUrl: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async () => {
        const dataUrl = reader.result as string
        const { data } = await api.post('/posts/upload', { data: dataUrl })
        resolve(data)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  },

  updatePost: async ({ id, ...input }: UpdatePostInput & { id: string }) => {
    const { data } = await api.patch<Post>(`/posts/${id}`, input)
    return data
  },

  deletePost: async (id: string) => {
    await api.delete(`/posts/${id}`)
  },

  getUserPosts: async (userId: string) => {
    const { data } = await api.get<Post[]>(`/posts/user/${userId}`)
    return data
  },

  getPostsByTag: async (tag: string) => {
    const { data } = await api.get<Post[]>(`/posts/tag/${tag}`)
    return data
  },
}