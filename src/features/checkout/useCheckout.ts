
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { orderService } from './orderService'
import { cartQueryKey } from '../cart/useCart'
import { notifyStockChanged } from '../../lib/realtime/socket'
import type { CheckoutInput } from '../../types/order'

export function useCheckoutQuote(couponCode: string) {
  return useQuery({
    queryKey: ['checkout', 'quote', couponCode],
    queryFn: ({ signal }) =>
      orderService.quote(couponCode, signal),
    retry: false,
    staleTime: 0,
  })
}

export function useCheckout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CheckoutInput) =>
      orderService.checkout(input),

    onSuccess: async (order) => {
      queryClient.setQueryData(
        ['order', order.id],
        order,
      )

      if (order.status === 'confirmed') {
        notifyStockChanged(
          order.items.map((item) => item.nftId),
          order.id,
        )
      }

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
          queryKey: ['checkout', 'quote'],
        }),
      ])
    },
  })
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: ({ signal }) =>
      orderService.getById(orderId, signal),
    enabled: Boolean(orderId),
    retry: 1,
  })
}
