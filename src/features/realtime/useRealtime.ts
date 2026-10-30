
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  getSocket,
  type StockUpdatedEvent,
} from '../../lib/realtime/socket'

export type RealtimeStatus =
  | 'connected'
  | 'connecting'
  | 'disconnected'

export function useRealtime(): RealtimeStatus {
  const queryClient = useQueryClient()

  const [status, setStatus] =
    useState<RealtimeStatus>('connecting')

  useEffect(() => {
    const socket = getSocket()

    function onConnect() {
      setStatus('connected')

      void queryClient.invalidateQueries({
        queryKey: ['nfts'],
      })

      void queryClient.invalidateQueries({
        queryKey: ['nft'],
      })
    }

    function onDisconnect() {
      setStatus('disconnected')
    }

    function onConnectError() {
      setStatus('disconnected')
    }

    function onStockUpdated(event: StockUpdatedEvent) {
      if (!Array.isArray(event.nftIds)) return

      void queryClient.invalidateQueries({
        queryKey: ['nfts'],
      })

      for (const nftId of event.nftIds) {
        void queryClient.invalidateQueries({
          queryKey: ['nft', nftId],
        })
      }
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onConnectError)
    socket.on('nft:stock-updated', onStockUpdated)

    if (socket.connected) {
      onConnect()
    } else {
      socket.connect()
    }

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onConnectError)
      socket.off('nft:stock-updated', onStockUpdated)
    }
  }, [queryClient])

  return status
}
