import api from './client'
import type { User, UserSkill, UpdateProfileInput } from '../types'

export const usersApi = {
  getMyProfile: async () => {
    const { data } = await api.get<User>('/users/profile')
    return data
  },

  getProfile: async (id: string) => {
    const { data } = await api.get<User>(`/users/profile/${id}`)
    return data
  },

  getProfileByUsername: async (username: string) => {
    const { data } = await api.get<User>(`/users/username/${username}`)
    return data
  },

  updateProfile: async (input: UpdateProfileInput) => {
    const { data } = await api.patch<User>('/users/profile', input)
    return data
  },

  addSkill: async (skill: string, level: string) => {
    const { data } = await api.post<UserSkill>('/users/skills', { skill, level })
    return data
  },

  updateSkill: async (skillId: string, level: string) => {
    const { data } = await api.patch<UserSkill>(`/users/skills/${skillId}`, { level })
    return data
  },

  removeSkill: async (skillId: string) => {
    await api.delete(`/users/skills/${skillId}`)
  },

  getSkills: async (userId?: string) => {
    const url = userId ? `/users/skills/${userId}` : '/users/skills'
    const { data } = await api.get<UserSkill[]>(url)
    return data
  },

  searchUsers: async (query: string) => {
    const { data } = await api.get<User[]>(`/users/search?q=${query}`)
    return data
  },
}