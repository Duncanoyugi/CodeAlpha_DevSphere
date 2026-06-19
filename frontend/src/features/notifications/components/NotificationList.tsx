import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '../hooks/useNotifications'
import { NotificationItem } from './NotificationItem'
import { EmptyState } from '../../../components/common/EmptyState'
import { Button } from '../../../components/ui/button'
import { Bell, CheckCheck } from 'lucide-react'
import { NotificationSkeleton } from '../../../components/LoadingSkeleton'

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
    return <NotificationSkeleton />
  }

  if (error) {
    return (
      <EmptyState
        title="Notifications unavailable"
        description="Failed to load notifications."
        icon={<Bell className="h-12 w-12" />}
      />
    )
  }

  if (!notifications || notifications.length === 0) {
    return (
      <EmptyState
        title="No notifications"
        description="You're all caught up."
        icon={<Bell className="h-12 w-12" />}
      />
    )
  }

  const hasUnread = notifications.some((n) => !n.read)

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      {hasUnread && (
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--accent)]/40 p-3">
          <p className="text-sm font-semibold text-[var(--accent-foreground)]">Unread updates</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-lg text-xs"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
          >
            <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Mark all as read
          </Button>
        </div>
      )}
      <div>
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
