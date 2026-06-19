import { Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { Button } from '../../components/ui/button'
import { Avatar } from '../../components/Avatar'
import { NotificationBell } from '../../features/notifications/components/NotificationBell'
import { SearchBar } from '../../features/search/components/SearchBar'
import { APP_DESCRIPTION, APP_NAME } from '../../lib/constants'

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--background)]/70">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4">
        <Link to="/" className="flex shrink-0 items-center gap-3" aria-label={`${APP_NAME} home`}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand)] text-sm font-bold text-[var(--brand-foreground)] ring-1 ring-[var(--ring)]/10">
            DS
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="font-semibold text-[var(--foreground)]">{APP_NAME}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">{APP_DESCRIPTION}</p>
          </div>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-2">
          <SearchBar className="hidden md:block" />
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <Link to={`/profile/${user?.username}`} aria-label={`Open ${user?.username || 'your'} profile`}>
                <Avatar name={user?.username || 'User'} src={user?.avatar || null} size="sm" />
              </Link>
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => logout()} aria-label="Log out">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
