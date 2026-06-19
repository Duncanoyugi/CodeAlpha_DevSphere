import { Link } from 'react-router-dom'
import { Award, Heart, MessageCircle, UserPlus } from 'lucide-react'
import { cn, formatDate } from '../../../lib/utils'
import type { Notification } from '../../../types'

interface NotificationItemProps {
  notification: Notification
  onRead?: () => void
}

const NotificationIcon = {
  LIKE: Heart,
  FOLLOW: UserPlus,
  COMMENT: MessageCircle,
  BADGE: Award,
}

const notificationCopy: Record<Notification['type'], string> = {
  LIKE: 'liked your post',
  FOLLOW: 'started following you',
  COMMENT: 'commented on your post',
  BADGE: 'earned a new badge',
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const Icon = NotificationIcon[notification.type]
  const isUnread = !notification.read

  const handleClick = () => {
    if (isUnread && onRead) {
      onRead()
    }
  }

  return (
    <Link
      to={notification.postId ? `/post/${notification.postId}` : '#'}
      onClick={handleClick}
      className={cn(
        'flex items-start gap-3 border-b border-[var(--border)] p-4 transition-colors last:border-b-0 hover:bg-[var(--accent)]/40',
        isUnread && 'bg-[var(--accent)]/30'
      )}
    >
      <div className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border', isUnread ? 'border-[var(--brand)] bg-[var(--brand)] text-[var(--brand-foreground)]' : 'border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)]')}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-6 text-[var(--foreground)]">
          <span className="font-semibold">{notification.actorName}</span>{' '}
          <span className="text-[var(--muted-foreground)]">{notificationCopy[notification.type]}</span>
        </p>
        <p className="mt-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          {formatDate(notification.createdAt)}
        </p>
      </div>
      {isUnread && (
        <span role="status" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--brand)]" aria-label="Unread notification" />
      )}
    </Link>
  )
}
