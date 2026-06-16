import { createContext, type ReactNode } from 'react'
import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000')

const SocketContext = createContext(socket)

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}