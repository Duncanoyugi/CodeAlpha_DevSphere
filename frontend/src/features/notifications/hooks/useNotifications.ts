import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '../../../api/notifications.api'
import { useToast } from '../../../components/ui/use-toast'
import { useEffect } from 'react'
import socketService from '../../../services/socket.service'

type Notification = {
  id: string
  read?: boolean
}

type UnreadCount = {
  count: number
}

export function useNotifications(limit: number = 50) {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getNotifications(limit),
    refetchInterval: 30000,
  })
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => notificationsApi.getUnreadCount(),
    refetchInterval: 30000,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })
      await queryClient.cancelQueries({ queryKey: ['notifications', 'unread'] })

      const prevNotifications = queryClient.getQueryData<Notification[]>(['notifications'])
      const prevUnread = queryClient.getQueryData<UnreadCount>(['notifications', 'unread'])

      queryClient.setQueryData<Notification[]>(['notifications'], (old) => {
        if (!old) return old
        return old.map((n) => (n.id === id ? { ...n, read: true } : n))
      })

      queryClient.setQueryData<UnreadCount>(['notifications', 'unread'], (old) => {
        if (!old) return old
        return { ...old, count: Math.max(0, old.count - 1) }
      })

      return { prevNotifications, prevUnread }
    },

    onError: (
      error: unknown,
      _id: string,
      ctx: { prevNotifications?: Notification[]; prevUnread?: UnreadCount } | undefined
    ) => {
      if (ctx?.prevNotifications) queryClient.setQueryData(['notifications'], ctx.prevNotifications)
      if (ctx?.prevUnread) queryClient.setQueryData(['notifications', 'unread'], ctx.prevUnread)

      const message =
        (error as any)?.response?.data?.message ||
        (error instanceof Error ? error.message : 'Failed to mark notification as read')

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })
      await queryClient.cancelQueries({ queryKey: ['notifications', 'unread'] })

      const prevNotifications = queryClient.getQueryData<Notification[]>(['notifications'])
      const prevUnread = queryClient.getQueryData<UnreadCount>(['notifications', 'unread'])

      queryClient.setQueryData<Notification[]>(['notifications'], (old) => {
        if (!old) return old
        return old.map((n) => ({ ...n, read: true }))
      })

      queryClient.setQueryData<UnreadCount>(['notifications', 'unread'], (old) => {
        if (!old) return old
        return { ...old, count: 0 }
      })

      return { prevNotifications, prevUnread }
    },

    onError: (
      error: unknown,
      _vars: void,
      ctx: { prevNotifications?: Notification[]; prevUnread?: UnreadCount } | undefined
    ) => {
      if (ctx?.prevNotifications) queryClient.setQueryData(['notifications'], ctx.prevNotifications)
      if (ctx?.prevUnread) queryClient.setQueryData(['notifications', 'unread'], ctx.prevUnread)

      const message =
        (error as any)?.response?.data?.message ||
        (error instanceof Error ? error.message : 'Failed to mark all as read')

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] })
      toast({
        title: 'All read',
        description: 'All notifications marked as read.',
      })
    },
  })
}

export function useNotificationSocket() {
  const { refetch } = useNotifications()
  const { refetch: refetchUnread } = useUnreadCount()

  useEffect(() => {
    const handleNewNotification = () => {
      refetch()
      refetchUnread()
    }

    socketService.on('new_notification', handleNewNotification)

    return () => {
      socketService.off('new_notification', handleNewNotification)
    }
  }, [refetch, refetchUnread])
}

