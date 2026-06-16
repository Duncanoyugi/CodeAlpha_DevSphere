import { useEffect } from 'react'
import { useAppDispatch } from './app/hooks'
import { getMe } from './features/auth/authSlice'
import { AppRoutes } from './routing/AppRoutes'
import { Toaster } from './components/ui/toaster'

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getMe())
  }, [dispatch])

  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  )
}

export default App