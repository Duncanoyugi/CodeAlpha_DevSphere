import { Outlet } from 'react-router-dom'
import { useAppSelector } from '../../../app/hooks'
import { LoadingSpinner } from '../../../components/common/LoadingSpinner'

export function AuthGuard() {
  const { isLoading } = useAppSelector((state) => state.auth)

  // Never redirect while the initial /auth/me request is in-flight.
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Do not force navigation to /login on cold-start or when unauthenticated.
  // Protected content should be gated by route-level guards.
  return <Outlet />
}

