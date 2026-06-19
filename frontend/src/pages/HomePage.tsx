import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { LandingPage } from './LandingPage'

export function HomePage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  if (isAuthenticated) {
    return <Navigate to="/feed" replace />
  }

  return <LandingPage />
}

