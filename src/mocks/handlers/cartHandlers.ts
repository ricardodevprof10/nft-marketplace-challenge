
import { http, HttpResponse } from 'msw'

import type {
  Cart,
  CartItem,
  AddCartItemInput,
  UpdateCartItemInput,
} from '../../types/cart'

const STORAGE_KEY = 'nft-marketplace-cart-v1'
const WEI_PER_ETH = 10n ** 18n

function ethToWei(value: string): bigint {
  if (!/^\d+(\.\d{1,18})?$/.test(value)) {
    throw new Error('Preço ETH inválido')
  }

  const [whole, fraction = ''] = value.split('.')

  return (
    BigInt(whole) * WEI_PER_ETH +
    BigInt(fraction.padEnd(18, '0'))
  )
}

function weiToEth(value: bigint): string {
  const whole = value / WEI_PER_ETH

  const fraction = (value % WEI_PER_ETH)
    .toString()
    .padStart(18, '0')
    .replace(/0+$/, '')

  return fraction
    ? `${whole}.${fraction}`
    : whole.toString()
}

function isValidItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') {
    return false
  }

  const item = value as Record<string, unknown>

  return (
    typeof item.nftId === 'string' &&
    item.nftId.length > 0 &&
    typeof item.name === 'string' &&
    typeof item.imageUrl === 'string' &&
    typeof item.collection === 'string' &&
    typeof item.priceEth === 'string' &&
    /^\d+(\.\d{1,18})?$/.test(item.priceEth) &&
    typeof item.quantity === 'number' &&
    Number.isSafeInteger(item.quantity) &&
    item.quantity > 0 &&
    typeof item.available === 'number' &&
    Number.isSafeInteger(item.available) &&
    item.available >= item.quantity
  )
}

function readItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return []
    }

    const parsed: unknown = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(isValidItem)
  } catch {
    return []
  }
}

function saveItems(items: CartItem[]): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(items),
  )
}

function buildCart(items: CartItem[]): Cart {
  const totalWei = items.reduce(
    (sum, item) =>
      sum +
      ethToWei(item.priceEth) * BigInt(item.quantity),
    0n,
  )

  return {
    items,
    totalItems: items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    ),
    totalEth: weiToEth(totalWei),
  }
}

function errorResponse(
  message: string,
  status: number,
) {
  return HttpResponse.json(
    { message },
    { status },
  )
}

export const cartHandlers = [
  http.get('/api/cart', () => {
    return HttpResponse.json(
      buildCart(readItems()),
    )
  }),

  http.post('/api/cart/items', async ({ request }) => {
    let body: unknown

    try {
      body = await request.json()
    } catch {
      return errorResponse('JSON inválido', 400)
    }

    if (!isValidItem(body)) {
      return errorResponse(
        'Dados do NFT inválidos',
        400,
      )
    }

    const input = body as AddCartItemInput
    const items = readItems()

    const existing = items.find(
      (item) => item.nftId === input.nftId,
    )

    if (existing) {
      const newQuantity =
        existing.quantity + input.quantity

      if (newQuantity > input.available) {
        return errorResponse(
          'Quantidade superior ao estoque disponível',
          409,
        )
      }

      existing.quantity = newQuantity
      existing.available = input.available
      existing.priceEth = input.priceEth
      existing.name = input.name
      existing.imageUrl = input.imageUrl
      existing.collection = input.collection
    } else {
      items.push(input)
    }

    try {
      saveItems(items)
    } catch {
      return errorResponse(
        'Falha ao salvar o carrinho',
        500,
      )
    }

    return HttpResponse.json(
      buildCart(items),
      { status: 201 },
    )
  }),

  http.patch(
    '/api/cart/items/:nftId',
    async ({ params, request }) => {
      let body: unknown

      try {
        body = await request.json()
      } catch {
        return errorResponse(
          'JSON inválido',
          400,
        )
      }

      const input = body as UpdateCartItemInput

      if (
        !input ||
        !Number.isSafeInteger(input.quantity) ||
        input.quantity < 1
      ) {
        return errorResponse(
          'Quantidade inválida',
          400,
        )
      }

      const items = readItems()

      const item = items.find(
        (entry) =>
          entry.nftId === String(params.nftId),
      )

      if (!item) {
        return errorResponse(
          'NFT não está no carrinho',
          404,
        )
      }

      if (input.quantity > item.available) {
        return errorResponse(
          'Estoque insuficiente',
          409,
        )
      }

      item.quantity = input.quantity

      try {
        saveItems(items)
      } catch {
        return errorResponse(
          'Falha ao salvar o carrinho',
          500,
        )
      }

      return HttpResponse.json(
        buildCart(items),
      )
    },
  ),

  http.delete(
    '/api/cart/items/:nftId',
    ({ params }) => {
      const items = readItems()

      const updated = items.filter(
        (item) =>
          item.nftId !== String(params.nftId),
      )

      if (updated.length === items.length) {
        return errorResponse(
          'NFT não está no carrinho',
          404,
        )
      }

      try {
        saveItems(updated)
      } catch {
        return errorResponse(
          'Falha ao salvar o carrinho',
          500,
        )
      }

      return HttpResponse.json(
        buildCart(updated),
      )
    },
  ),

  http.delete('/api/cart', () => {
    try {
      saveItems([])
    } catch {
      return errorResponse(
        'Falha ao limpar o carrinho',
        500,
      )
    }

    return HttpResponse.json(
      buildCart([]),
    )
  }),
]
