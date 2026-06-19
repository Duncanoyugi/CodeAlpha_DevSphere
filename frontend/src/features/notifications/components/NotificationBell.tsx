import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '../../../components/ui/button.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu.tsx'
import { NotificationList } from './NotificationList.tsx'
import { useUnreadCount } from '../hooks/useNotifications.ts'
import { Badge } from '../../../components/Badge.tsx'

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { data: unreadCount } = useUnreadCount()

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-xl" aria-label="Open notifications">
          <Bell className="h-5 w-5" aria-hidden="true" />
          {unreadCount && unreadCount.count > 0 && (
            <Badge
              variant="default"
              className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1.5 text-[10px] tabular-nums"
            >
              {unreadCount.count > 99 ? '99+' : unreadCount.count}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 max-h-[500px] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-0">
        <NotificationList onItemClick={() => setOpen(false)} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
