
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { orderService } from './orderService'
import { cartQueryKey } from '../cart/useCart'

import {
  notifyStockChanged,
  notifyNFTUpdated,
  notifyOrderUpdated,
} from '../../lib/realtime/socket'

import type {
  CheckoutInput,
  Order,
} from '../../types/order'

// Evita retransmitir notificações quando uma
// requisição idempotente devolve o mesmo pedido.
// O controle é local à sessão da aplicação.
const notifiedOrders = new Set<string>()

function notifyCheckoutEvents(
  order: Order,
): void {
  if (notifiedOrders.has(order.id)) {
    return
  }

  notifiedOrders.add(order.id)

  const timestamp =
    new Date().toISOString()

  notifyOrderUpdated({
    orderId: order.id,
    status: order.status,
    version: order.version ?? 1,
    timestamp,
  })

  if (order.status !== 'confirmed') {
    return
  }

  // Mantém compatibilidade com clientes antigos.
  notifyStockChanged(
    order.items.map(
      (item) => item.nftId,
    ),
    order.id,
  )

  for (const item of order.items) {
    const version =
      order.nftVersions?.[item.nftId]

    if (
      typeof version !== 'number' ||
      !Number.isSafeInteger(version) ||
      version < 1
    ) {
      continue
    }

    notifyNFTUpdated({
      nftId: item.nftId,
      version,
      timestamp,
    })
  }
}

export function useCheckoutQuote(
  couponCode: string,
) {
  return useQuery({
    queryKey: [
      'checkout',
      'quote',
      couponCode,
    ],
    queryFn: ({ signal }) =>
      orderService.quote(
        couponCode,
        signal,
      ),
    retry: false,
    staleTime: 0,
  })
}

export function useCheckout() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: (
      input: CheckoutInput,
    ) => orderService.checkout(input),

    onSuccess: async (order) => {
      queryClient.setQueryData(
        ['order', order.id],
        order,
      )

      notifyCheckoutEvents(order)

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: cartQueryKey,
        }),

        queryClient.invalidateQueries({
          queryKey: ['nfts'],
        }),

        queryClient.invalidateQueries({
          queryKey: ['nft'],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            'checkout',
            'quote',
          ],
        }),
      ])
    },
  })
}

export function useOrder(
  orderId: string,
) {
  return useQuery({
    queryKey: [
      'order',
      orderId,
    ],
    queryFn: ({ signal }) =>
      orderService.getById(
        orderId,
        signal,
      ),
    enabled: Boolean(orderId),
    retry: 1,
  })
}
