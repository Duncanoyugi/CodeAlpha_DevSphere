import { Link, useLocation } from 'react-router-dom'
import { Home, Users, Hash, Bookmark, Settings, TrendingUp, Plus } from 'lucide-react'
import { Button } from '../../components/ui/button'

const navItems = [
  { icon: Home, label: 'Feed', path: '/feed' },
  { icon: TrendingUp, label: 'Trending', path: '/trending' },
  { icon: Users, label: 'Developers', path: '/developers' },
  { icon: Hash, label: 'Technologies', path: '/technologies' },
  { icon: Bookmark, label: 'Saved', path: '/saved' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 border-r min-h-[calc(100vh-4rem)] p-4 hidden md:block">
      <div className="space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </div>

      <div className="mt-6 pt-6 border-t">
        <Button className="w-full gap-2" asChild>
          <Link to="/create-post">
            <Plus className="h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>
    </aside>
  )
}