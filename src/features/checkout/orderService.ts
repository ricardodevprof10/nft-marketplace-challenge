
import { api } from '../../lib/api/client'
import type {
  Order,
  CheckoutInput,
  CheckoutQuote,
} from '../../types/order'

export const orderService = {
  async quote(
    couponCode = '',
    signal?: AbortSignal,
  ): Promise<CheckoutQuote> {
    const response = await api.get<CheckoutQuote>(
      '/checkout/quote',
      {
        params: { coupon: couponCode },
        signal,
      },
    )

    return response.data
  },

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
