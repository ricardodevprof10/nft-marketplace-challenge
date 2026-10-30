
import { api } from '../../lib/api/client'
import type { Order, CheckoutInput } from '../../types/order'

export const orderService = {
  async checkout(input: CheckoutInput): Promise<Order> {
    const response = await api.post<Order>(
      '/checkout',
      input,
    )

    return response.data
  },

  async getById(
    orderId: string,
    signal?: AbortSignal,
  ): Promise<Order> {
    const response = await api.get<Order>(
      `/orders/${encodeURIComponent(orderId)}`,
      { signal },
    )

    return response.data
  },
}
