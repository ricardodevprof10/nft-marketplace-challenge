
import { useQuery } from '@tanstack/react-query'
import { nftService } from './nftService'
import type { NFTFilters } from '../../types/nft'

export function useNFTs(filters: NFTFilters) {
  return useQuery({
    queryKey: ['nfts', filters],
    queryFn: ({ signal }) =>
      nftService.getAll(filters, signal),
  })
}
