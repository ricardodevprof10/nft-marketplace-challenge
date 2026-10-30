
import { api } from '../../lib/api/client'
import type {
  Wallet,
  CreateWalletInput,
} from '../../types/wallet'

export const walletService = {
  async getAll(signal?: AbortSignal): Promise<Wallet[]> {
    const response = await api.get<Wallet[]>(
      '/wallets',
      { signal },
    )

    return response.data
  },

  async create(input: CreateWalletInput): Promise<Wallet> {
    const response = await api.post<Wallet>(
      '/wallets',
      input,
    )

    return response.data
  },

  async remove(walletId: string): Promise<void> {
    await api.delete(
      `/wallets/${encodeURIComponent(walletId)}`,
    )
  },
}
