import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '../hooks/useNotifications'
import { NotificationItem } from './NotificationItem'
import { LoadingSpinner } from '../../../components/common/LoadingSpinner'
import { EmptyState } from '../../../components/common/EmptyState'
import { Button } from '../../../components/ui/button'
import { Bell, CheckCheck } from 'lucide-react'

interface NotificationListProps {
  onItemClick?: () => void
}

export function NotificationList({ onItemClick }: NotificationListProps) {
  const { data: notifications, isLoading, error } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const handleMarkRead = (id: string) => {
    markRead.mutate(id)
    if (onItemClick) onItemClick()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-sm text-destructive">
        Failed to load notifications
      </div>
    )
  }

  if (!notifications || notifications.length === 0) {
    return (
      <EmptyState
        title="No notifications"
        description="You're all caught up!"
        icon={<Bell className="h-8 w-8 text-muted-foreground" />}
        className="py-8"
      />
    )
  }

  const hasUnread = notifications.some((n) => !n.read)

  return (
    <div>
      {hasUnread && (
        <div className="px-4 py-2 border-b">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-xs"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
          >
            <CheckCheck className="h-3 w-3 mr-2" />
            Mark all as read
          </Button>
        </div>
      )}
      <div className="divide-y">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRead={() => handleMarkRead(notification.id)}
          />
        ))}
      </div>
    </div>
  )
}