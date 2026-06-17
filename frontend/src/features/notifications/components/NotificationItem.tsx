import { Link } from 'react-router-dom'
import { Heart, UserPlus, MessageCircle, Award } from 'lucide-react'
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

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const Icon = NotificationIcon[notification.type as keyof typeof NotificationIcon] || Heart
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
        'flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors',
        isUnread && 'bg-muted/20'
      )}
    >
      <div className="mt-0.5">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-semibold">{notification.actorName}</span>
          {notification.type === 'LIKE' && ' liked your post'}
          {notification.type === 'FOLLOW' && ' started following you'}
          {notification.type === 'COMMENT' && ' commented on your post'}
          {notification.type === 'BADGE' && ' earned a new badge'}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDate(notification.createdAt)}
        </p>
      </div>
      {isUnread && (
        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
      )}
    </Link>
  )
}