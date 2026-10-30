
export interface CartItem {
  nftId: string
  name: string
  imageUrl: string
  collection: string
  priceEth: string
  quantity: number
  available: number
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  totalEth: string
}

export type AddCartItemInput = CartItem

export interface UpdateCartItemInput {
  quantity: number
}
