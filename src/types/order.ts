
import type { CartItem } from './cart'

export type OrderStatus = 'confirmed'

export interface Order {
  id: string
  items: CartItem[]
  totalItems: number
  totalEth: string
  status: OrderStatus
  createdAt: string
}

export interface CheckoutInput {
  requestId: string
}
