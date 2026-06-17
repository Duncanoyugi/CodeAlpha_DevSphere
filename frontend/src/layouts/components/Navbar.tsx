import { Link } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { Button } from '../../components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { NotificationBell } from '../../features/notifications/components/NotificationBell'
import { SearchBar } from '../../features/search/components/SearchBar'
import { getInitials } from '../../lib/utils'

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">DevSphere</span>
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <SearchBar className="hidden md:block" />

          {isAuthenticated ? (
            <>
              <NotificationBell />
              <Link to={`/profile/${user?.username}`}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar || undefined} />
                  <AvatarFallback>
                    {user?.username ? getInitials(user.username) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                Logout
              </Button>
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}