import { Link, useLocation } from 'react-router-dom'
import { Home, Users, Hash, Bookmark, Settings, TrendingUp, Plus, Bell } from 'lucide-react'
import { Button } from '../../components/ui/button.tsx'
import { useUnreadCount } from '../../features/notifications/hooks/useNotifications.ts'
import { Badge } from '../../components/Badge.tsx'
import { cn } from '../../lib/utils.ts'

const navItems = [
  { icon: Home, label: 'Feed', path: '/feed' },
  { icon: TrendingUp, label: 'Trending', path: '/trending' },
  { icon: Users, label: 'Developers', path: '/developers' },
  { icon: Hash, label: 'Technologies', path: '/technologies' },
  { icon: Bookmark, label: 'Saved', path: '/saved' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export function Sidebar() {
  const location = useLocation()
  const { data: unreadData } = useUnreadCount()
  const unreadCount = unreadData?.count ?? 0

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`)

  return (
    <aside className="hidden w-72 shrink-0 border-r border-[var(--border)] bg-[var(--surface)]/70 p-4 md:block">
      <nav className="space-y-1" aria-label="Primary navigation">
        {navItems.map((item) => {
          const active = isActive(item.path)
          return (
            <Link key={item.path} to={item.path} className="relative">
              <Button
                variant={active ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3 rounded-xl px-3',
                  active && 'bg-[var(--accent)] text-[var(--accent-foreground)] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:rounded-full before:bg-[var(--brand)] before:content-[""]'
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="flex-1 text-sm font-semibold">{item.label}</span>
                {item.path === '/notifications' && unreadCount > 0 && (
                  <Badge variant="default" className="ml-auto h-5 min-w-5 rounded-full px-1.5 text-[10px] tabular-nums">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="mt-6 border-t border-[var(--border)] pt-6">
        <Button className="w-full rounded-xl" asChild>
          <Link to="/create-post">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Post
          </Link>
        </Button>
      </div>
    </aside>
  )
}
