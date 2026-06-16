import api from './client'
import type { Notification } from '../types'

export const notificationsApi = {
  getNotifications: async (limit?: number) => {
    const { data } = await api.get<Notification[]>('/notifications', { params: { limit } })
    return data
  },

  getUnreadCount: async () => {
    const { data } = await api.get<{ count: number }>('/notifications/unread/count')
    return data
  },

  markAsRead: async (id: string) => {
    await api.patch(`/notifications/${id}/read`)
  },

  markAllAsRead: async () => {
    await api.patch('/notifications/read-all')
  },
}