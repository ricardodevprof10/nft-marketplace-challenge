
export interface Wallet {
  id: string
  userId: string
  label: string
  address: string
  createdAt: string
}

export interface CreateWalletInput {
  label: string
  address: string
}
