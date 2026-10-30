
import { api } from '../../lib/api/client'
import type { NFT } from '../../types/nft'

export type FavoriteListResponse = {
  items: NFT[]
  total: number
}

export const favoriteService = {
  async list(): Promise<FavoriteListResponse> {
    const response =
      await api.get<FavoriteListResponse>('/favorites')

    return response.data
  },

  async add(nftId: string): Promise<void> {
    await api.post(`/favorites/${encodeURIComponent(nftId)}`)
  },

  async remove(nftId: string): Promise<void> {
    await api.delete(
      `/favorites/${encodeURIComponent(nftId)}`,
    )
  },
}
