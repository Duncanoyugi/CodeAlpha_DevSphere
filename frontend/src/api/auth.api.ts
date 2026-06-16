import api from './client'
import type { LoginInput, RegisterInput, User } from '../types'

export const authApi = {
  register: async (input: RegisterInput) => {
    const { data } = await api.post<User>('/auth/register', input)
    return data
  },

  login: async (input: LoginInput) => {
    const { data } = await api.post<User>('/auth/login', input)
    return data
  },

  logout: async () => {
    await api.post('/auth/logout')
  },

  getMe: async () => {
    const { data } = await api.get<User>('/auth/me')
    return data
  },

  refresh: async () => {
    const { data } = await api.post('/auth/refresh')
    return data
  },
}