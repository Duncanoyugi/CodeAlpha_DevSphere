import api from './client'
import type { Post, CreatePostInput, UpdatePostInput } from '../types'

export const postsApi = {
  getFeed: async (params?: { limit?: number; cursor?: string }) => {
    const { data } = await api.get('/feed/home', { params })
    return data
  },

  getTrending: async (limit?: number) => {
    const { data } = await api.get('/feed/trending', { params: { limit } })
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