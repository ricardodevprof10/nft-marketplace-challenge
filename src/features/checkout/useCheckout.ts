
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { orderService } from './orderService'
import { cartQueryKey } from '../cart/useCart'
import type { CheckoutInput } from '../../types/order'

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

      await queryClient.invalidateQueries({
        queryKey: cartQueryKey,
      })

      await queryClient.invalidateQueries({
        queryKey: ['nfts'],
      })

      await queryClient.invalidateQueries({
        queryKey: ['nft'],
      })
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
