
export type NFT = {
  id: string
  name: string
  description: string
  imageUrl: string
  collection: string
  creator: string
  priceEth: string
  available: number
  edition: string
  category: string
}

export type NFTFilters = {
  search?: string
  category?: string
  sort?: 'newest' | 'price_asc' | 'price_desc'
  page?: number
  limit?: number
}

export type NFTListResponse = {
  items: NFT[]
  total: number
  page: number
  limit: number
  totalPages: number
}
