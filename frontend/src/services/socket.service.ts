import { io, Socket } from 'socket.io-client'

class SocketService {
  private socket: Socket | null = null
  private listeners: Map<string, Set<Function>> = new Map()

  connect() {
    const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000'

    this.socket = io(WS_URL, {
      withCredentials: true,
      transports: ['websocket'],
    })

    this.socket.on('connect', () => {
      // no-op
    })

    this.socket.on('disconnect', () => {
      // no-op
    })

    this.socket.on('new_notification', (data: unknown) => {
      this.notifyListeners('new_notification', data)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)?.add(callback)
  }

  off(event: string, callback: Function) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)?.delete(callback)
    }
  }

  private notifyListeners(event: string, data: unknown) {
    this.listeners.get(event)?.forEach((callback) => callback(data))
  }

  getSocket() {
    return this.socket
  }

  isConnected() {
    return this.socket?.connected || false
  }
}

export const socketService = new SocketService()
export default socketService