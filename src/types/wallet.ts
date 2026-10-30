export interface Wallet {
  id: string
  userId: string
  label: string
  address: string
  createdAt: string
  isPrimary?: boolean
}

export interface CreateWalletInput {
  label: string
  address: string
  isPrimary?: boolean
}

export interface UpdateWalletInput extends CreateWalletInput {
  walletId: string
}
