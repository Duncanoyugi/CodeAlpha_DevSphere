import { useAppDispatch } from '../../../app/hooks'
import { logout } from '../authSlice'

import { useMeQuery } from './useMeQuery'

export function useAuth() {
  const dispatch = useAppDispatch()
  const { data, isLoading } = useMeQuery()

  const handleLogout = async () => {
    await dispatch(logout())
  }

  return {
    user: data,
    isAuthenticated: !!data,
    isLoading,
    logout: handleLogout,
  }
}
