
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { cartService } from './cartService'

import type {
  Cart,
  AddCartItemInput,
  UpdateCartItemInput,
} from '../../types/cart'

export const cartQueryKey = ['cart'] as const

export function useCart() {
  return useQuery({
    queryKey: cartQueryKey,
    queryFn: ({ signal }) => cartService.getCart(signal),
    staleTime: 0,
    refetchOnWindowFocus: true,
  })
}

export function useCartActions() {
  const queryClient = useQueryClient()

  function updateCache(cart: Cart) {
    queryClient.setQueryData(cartQueryKey, cart)
  }

  const addItem = useMutation({
    mutationFn: (input: AddCartItemInput) =>
      cartService.addItem(input),
    onSuccess: updateCache,
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: cartQueryKey,
      }),
  })

  const updateItem = useMutation({
    mutationFn: ({
      nftId,
      quantity,
    }: {
      nftId: string
      quantity: number
    }) =>
      cartService.updateItem(nftId, {
        quantity,
      } satisfies UpdateCartItemInput),
    onSuccess: updateCache,
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: cartQueryKey,
      }),
  })

  const removeItem = useMutation({
    mutationFn: (nftId: string) =>
      cartService.removeItem(nftId),
    onSuccess: updateCache,
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: cartQueryKey,
      }),
  })

  const clearCart = useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: updateCache,
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: cartQueryKey,
      }),
  })

  return {
    addItem,
    updateItem,
    removeItem,
    clearCart,
  }
}
