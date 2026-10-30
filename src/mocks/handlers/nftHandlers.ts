
import { http, HttpResponse, delay } from 'msw'
import type { NFT, NFTListResponse } from '../../types/nft'
import { getDatabase, resetDatabase } from '../store/database'

const BASE_URL = '/api'

function sortNFTs(items: NFT[], sort: string): NFT[] {
  const sorted = [...items]

  switch (sort) {
    case 'price_asc':
      return sorted.sort((a, b) =>
        compareEth(a.priceEth, b.priceEth),
      )

    case 'price_desc':
      return sorted.sort((a, b) =>
        compareEth(b.priceEth, a.priceEth),
      )

    case 'newest':
    default:
      return sorted.sort(
        (a, b) => Number(b.id) - Number(a.id),
      )
  }
}

function ethUnits(value: string): bigint {
  const [whole, fraction = ''] = value.split('.')

  return (
    BigInt(whole) * 10n ** 18n +
    BigInt(fraction.padEnd(18, '0'))
  )
}

function compareEth(a: string, b: string): number {
  const first = ethUnits(a)
  const second = ethUnits(b)

  return first < second ? -1 : first > second ? 1 : 0
}

export const nftHandlers = [
  http.get(`${BASE_URL}/nfts`, async ({ request }) => {
    await delay(350)

    const url = new URL(request.url)

    const search = (url.searchParams.get('search') ?? '')
      .trim()
      .toLowerCase()

    const category = url.searchParams.get('category') ?? ''
    const sort = url.searchParams.get('sort') ?? 'newest'

    const page = Number(url.searchParams.get('page') ?? 1)
    const limit = Number(url.searchParams.get('limit') ?? 8)

    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100 ||
      !['newest', 'price_asc', 'price_desc'].includes(sort)
    ) {
      return HttpResponse.json(
        {
          code: 'VALIDATION_ERROR',
          message: 'Parâmetros de consulta inválidos.',
        },
        { status: 400 },
      )
    }

    let items = [...getDatabase().nfts]

    if (search) {
      items = items.filter((nft) =>
        [
          nft.name,
          nft.collection,
          nft.creator,
          nft.description,
        ].some((value) => value.toLowerCase().includes(search)),
      )
    }

    if (category) {
      items = items.filter((nft) => nft.category === category)
    }

    items = sortNFTs(items, sort)

    const total = items.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit

    const response: NFTListResponse = {
      items: items.slice(start, start + limit),
      total,
      page,
      limit,
      totalPages,
    }

    return HttpResponse.json(response)
  }),


  
  http.get(`${BASE_URL}/nfts/:id`, async ({ params }) => {
    await delay(250)

    const nft = getDatabase().nfts.find(
      (item) => item.id === params.id,
    )

    if (!nft) {
      return HttpResponse.json(
        {
          code: 'NFT_NOT_FOUND',
          message: 'NFT não encontrado.',
        },
        { status: 404 },
      )
    }

    return HttpResponse.json(nft)
  }),

  http.post(`${BASE_URL}/__mock/reset`, () => {
    resetDatabase()

    return HttpResponse.json({
      success: true,
      message: 'Cenário restaurado.',
    })
  }),
]
