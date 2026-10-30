
import { api } from '../../lib/api/client'
import type {
  NFT,
  NFTFilters,
  NFTListResponse,
} from '../../types/nft'

export const nftService = {
  async getAll(
    filters: NFTFilters,
    signal?: AbortSignal,
  ): Promise<NFTListResponse> {
    const response = await api.get<NFTListResponse>(
      '/nfts',
      {
        params: filters,
        signal,
      },
    )

    return response.data
  },

  async getById(
    id: string,
    signal?: AbortSignal,
  ): Promise<NFT> {
    const response = await api.get<NFT>(
      `/nfts/${encodeURIComponent(id)}`,
      { signal },
    )

    return response.data
  },
}
