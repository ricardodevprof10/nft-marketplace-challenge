
import { useQuery } from '@tanstack/react-query'
import { nftService } from './nftService'

export function useNFTDetail(nftId: string) {
  return useQuery({
    queryKey: ['nft', nftId],
    queryFn: ({ signal }) =>
      nftService.getById(nftId, signal),
    enabled: nftId.length > 0,
    retry: 1,
  })
}
