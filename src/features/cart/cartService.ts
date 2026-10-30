
import { api } from '../../lib/api/client'

import type {
  Cart,
  AddCartItemInput,
  UpdateCartItemInput,
} from '../../types/cart'

export const cartService = {
  async getCart(signal?: AbortSignal): Promise<Cart> {
    const response = await api.get<Cart>('/cart', {
      signal,
    })

    return response.data
  },

  async addItem(input: AddCartItemInput): Promise<Cart> {
    const response = await api.post<Cart>(
      '/cart/items',
      input,
    )

    return response.data
  },

  async updateItem(
    nftId: string,
    input: UpdateCartItemInput,
  ): Promise<Cart> {
    const response = await api.patch<Cart>(
      `/cart/items/${encodeURIComponent(nftId)}`,
      input,
    )

    return response.data
  },

  async removeItem(nftId: string): Promise<Cart> {
    const response = await api.delete<Cart>(
      `/cart/items/${encodeURIComponent(nftId)}`,
    )

    return response.data
  },

  async clearCart(): Promise<Cart> {
    const response = await api.delete<Cart>('/cart')

    return response.data
  },
}
