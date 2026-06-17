import { Outlet } from 'react-router-dom'
import { useAuth } from '../features/auth/hooks/useAuth'


export function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  // On cold-start, /auth/me can temporarily fail while cookies are not yet available.
  // Do not immediately redirect; let the app settle.
  if (!isAuthenticated) {
    return <Outlet />
  }

  return <Outlet />
}

