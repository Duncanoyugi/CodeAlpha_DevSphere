import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'

export function HomePage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  return <Navigate to={isAuthenticated ? '/feed' : '/login'} replace />
}

