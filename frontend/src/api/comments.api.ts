import api from './client'
import type { Comment, CreateCommentInput } from '../types'

export const commentsApi = {
  createComment: async (input: CreateCommentInput) => {
    const { data } = await api.post<Comment>('/comments', input)
    return data
  },

  deleteComment: async (id: string) => {
    await api.delete(`/comments/${id}`)
  },

  getComments: async (postId: string) => {
    const { data } = await api.get<Comment[]>(`/comments/post/${postId}`)
    return data
  },
}