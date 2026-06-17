import { createContext, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useAppSelector } from '../../app/hooks'
import socketService from '../../services/socket.service'
import { useQueryClient } from '@tanstack/react-query'

interface SocketContextType {
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
})

export function useSocket() {
  return useContext(SocketContext)
}

interface SocketProviderProps {
  children: ReactNode
}

export function SocketProvider({ children }: SocketProviderProps) {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated) {
      socketService.disconnect()
      return
    }

    socketService.connect()

    const onNewNotification = () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] })
    }

    // Event contracts from backend:
    // - post:liked / post:commented should invalidate post detail and feed
    const onPostLiked = () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }

    const onPostCommented = () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }

    socketService.on('new_notification', onNewNotification)
    socketService.on('post:liked', onPostLiked)
    socketService.on('post:commented', onPostCommented)

    return () => {
      socketService.off('new_notification', onNewNotification)
      socketService.off('post:liked', onPostLiked)
      socketService.off('post:commented', onPostCommented)
      socketService.disconnect()
    }
  }, [isAuthenticated, queryClient])

  return (
    <SocketContext.Provider value={{ isConnected: socketService.isConnected() }}>
      {children}
    </SocketContext.Provider>
  )
}
