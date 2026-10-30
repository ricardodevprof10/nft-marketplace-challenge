
import type { CartItem } from './cart'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'rejected'

export type PaymentScenario =
  | 'approved'
  | 'pending'
  | 'rejected'

export interface CheckoutInput {
  requestId: string
  couponCode?: string
  paymentScenario?: PaymentScenario
}

export interface CheckoutQuote {
  subtotalEth: string
  discountEth: string
  feeEth: string
  totalEth: string
  totalUsd: string
  ethUsdRate: string
  couponCode: string | null
  feePercent: number
  isDemoRate: boolean
}

export interface Order {
  id: string
  items: CartItem[]
  totalItems: number
  totalEth: string
  status: OrderStatus
  createdAt: string
  quote?: CheckoutQuote

  // Pedidos antigos continuam compatíveis.
  version?: number

  // Versões dos NFTs após a atualização de estoque.
  nftVersions?: Record<string, number>
}
