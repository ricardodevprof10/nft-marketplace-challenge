
import { io, type Socket } from 'socket.io-client'

export interface StockUpdatedEvent {
  nftIds: string[]
  orderId?: string
  timestamp: string
}

let socketInstance: Socket | null = null

function getSocketServerUrl(): string | undefined {
  const configuredUrl =
    import.meta.env.VITE_SOCKET_URL?.trim()

  if (!configuredUrl) {
    return undefined
  }

  return configuredUrl.replace(/\/+$/, '')
}

export function getSocket(): Socket {
  if (!socketInstance) {
    const serverUrl = getSocketServerUrl()

    socketInstance = io(
      serverUrl ?? undefined,
      {
        path: '/socket.io',
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        transports: ['websocket', 'polling'],
      },
    )
  }

  return socketInstance
}

export function notifyStockChanged(
  nftIds: string[],
  orderId?: string,
): void {
  const socket = getSocket()

  if (!socket.connected) return

  socket.emit('nft:stock-changed', {
    nftIds,
    orderId,
  })
}
