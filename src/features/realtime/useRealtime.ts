
import {
  useEffect,
  useRef,
  useState,
} from 'react'

import { useQueryClient } from '@tanstack/react-query'

import {
  getSocket,
  type StockUpdatedEvent,
} from '../../lib/realtime/socket'

import {
  isNFTUpdatedEvent,
  isOrderUpdatedEvent,
} from '../../lib/realtime/events'

import type { NFT } from '../../types/nft'
import type { Order } from '../../types/order'

export type RealtimeStatus =
  | 'connected'
  | 'connecting'
  | 'disconnected'

export function useRealtime(): RealtimeStatus {
  const queryClient = useQueryClient()

  const [status, setStatus] =
    useState<RealtimeStatus>('connecting')

  const nftVersions = useRef(
    new Map<string, number>(),
  )

  const orderVersions = useRef(
    new Map<string, number>(),
  )

  useEffect(() => {
    const socket = getSocket()

    function refreshCatalog() {
      void queryClient.invalidateQueries({
        queryKey: ['nfts'],
      })

      void queryClient.invalidateQueries({
        queryKey: ['nft'],
      })
    }

    function onConnect() {
      setStatus('connected')

      // Reconcilia os dados após reconexão.
      refreshCatalog()

      void queryClient.invalidateQueries({
        queryKey: ['cart'],
      })

      void queryClient.invalidateQueries({
        queryKey: ['order'],
      })
    }

    function onDisconnect() {
      setStatus('disconnected')
    }

    function onConnectError() {
      setStatus('disconnected')
    }

    function onStockUpdated(
      event: StockUpdatedEvent,
    ) {
      if (
        !event ||
        !Array.isArray(event.nftIds)
      ) {
        return
      }

      void queryClient.invalidateQueries({
        queryKey: ['nfts'],
      })

      for (const nftId of event.nftIds) {
        if (typeof nftId !== 'string') {
          continue
        }

        void queryClient.invalidateQueries({
          queryKey: ['nft', nftId],
        })
      }

      void queryClient.invalidateQueries({
        queryKey: ['cart'],
      })
    }

    function onNFTUpdated(payload: unknown) {
      if (!isNFTUpdatedEvent(payload)) {
        return
      }

      const cachedNFT =
        queryClient.getQueryData<NFT>([
          'nft',
          payload.nftId,
        ])

      const cachedVersion =
        cachedNFT?.version ?? 0

      const receivedVersion =
        nftVersions.current.get(
          payload.nftId,
        ) ?? 0

      const latestVersion = Math.max(
        cachedVersion,
        receivedVersion,
      )

      if (
        payload.version <= latestVersion
      ) {
        return
      }

      nftVersions.current.set(
        payload.nftId,
        payload.version,
      )

      void queryClient.invalidateQueries({
        queryKey: ['nfts'],
      })

      void queryClient.invalidateQueries({
        queryKey: [
          'nft',
          payload.nftId,
        ],
      })

      void queryClient.invalidateQueries({
        queryKey: ['cart'],
      })
    }

    function onOrderUpdated(payload: unknown) {
      if (!isOrderUpdatedEvent(payload)) {
        return
      }

      const cachedOrder =
        queryClient.getQueryData<Order>([
          'order',
          payload.orderId,
        ])

      const cachedVersion =
        cachedOrder?.version ?? 0

      const receivedVersion =
        orderVersions.current.get(
          payload.orderId,
        ) ?? 0

      const latestVersion = Math.max(
        cachedVersion,
        receivedVersion,
      )

      if (
        payload.version <= latestVersion
      ) {
        return
      }

      orderVersions.current.set(
        payload.orderId,
        payload.version,
      )

      void queryClient.invalidateQueries({
        queryKey: [
          'order',
          payload.orderId,
        ],
      })

      void queryClient.invalidateQueries({
        queryKey: ['orders'],
      })
    }

    socket.on('connect', onConnect)

    socket.on(
      'disconnect',
      onDisconnect,
    )

    socket.on(
      'connect_error',
      onConnectError,
    )

    socket.on(
      'nft:stock-updated',
      onStockUpdated,
    )

    socket.on(
      'nft.updated',
      onNFTUpdated,
    )

    socket.on(
      'order.updated',
      onOrderUpdated,
    )

    if (socket.connected) {
      onConnect()
    } else {
      socket.connect()
    }

    return () => {
      socket.off(
        'connect',
        onConnect,
      )

      socket.off(
        'disconnect',
        onDisconnect,
      )

      socket.off(
        'connect_error',
        onConnectError,
      )

      socket.off(
        'nft:stock-updated',
        onStockUpdated,
      )

      socket.off(
        'nft.updated',
        onNFTUpdated,
      )

      socket.off(
        'order.updated',
        onOrderUpdated,
      )
    }
  }, [queryClient])

  return status
}
