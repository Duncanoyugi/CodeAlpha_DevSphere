import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import { NotificationList } from './NotificationList'
import { useUnreadCount } from '../hooks/useNotifications'
import { Badge } from '../../../components/ui/badge'

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { data: unreadCount } = useUnreadCount()

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount && unreadCount.count > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount.count > 99 ? '99+' : unreadCount.count}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 max-h-[500px] overflow-y-auto">
        <NotificationList onItemClick={() => setOpen(false)} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}