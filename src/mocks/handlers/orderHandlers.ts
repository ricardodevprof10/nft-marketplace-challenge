
import { http, HttpResponse } from 'msw'
import type { CartItem } from '../../types/cart'
import type { Order, CheckoutInput } from '../../types/order'
import { getDatabase, updateNFT } from '../store/database'

const CART_KEY = 'nft-marketplace-cart-v1'
const ORDERS_KEY = 'nft-marketplace-orders-v1'
const REQUESTS_KEY = 'nft-marketplace-checkout-requests-v1'

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function readCart(): CartItem[] {
  const items = readJSON<unknown>(CART_KEY, [])

  if (!Array.isArray(items)) return []

  return items.filter((item): item is CartItem => {
    if (!item || typeof item !== 'object') return false

    const value = item as Record<string, unknown>

    return (
      typeof value.nftId === 'string' &&
      typeof value.quantity === 'number' &&
      Number.isSafeInteger(value.quantity) &&
      value.quantity > 0
    )
  })
}

function ethToWei(value: string): bigint {
  if (!/^\d+(\.\d{1,18})?$/.test(value)) {
    throw new Error('Preço inválido')
  }

  const [whole, fraction = ''] = value.split('.')

  return (
    BigInt(whole) * 10n ** 18n +
    BigInt(fraction.padEnd(18, '0'))
  )
}

function weiToEth(value: bigint): string {
  const whole = value / 10n ** 18n
  const fraction = (value % (10n ** 18n))
    .toString()
    .padStart(18, '0')
    .replace(/0+$/, '')

  return fraction ? `${whole}.${fraction}` : String(whole)
}

function failure(message: string, status: number) {
  return HttpResponse.json({ message }, { status })
}

export const orderHandlers = [
  http.post('/api/checkout', async ({ request }) => {
    let body: CheckoutInput

    try {
      body = (await request.json()) as CheckoutInput
    } catch {
      return failure('Requisição inválida', 400)
    }

    if (
      !body ||
      typeof body.requestId !== 'string' ||
      body.requestId.length < 8
    ) {
      return failure('Identificador de requisição inválido', 400)
    }

    const orders = readJSON<Order[]>(ORDERS_KEY, [])
    const requests = readJSON<Record<string, string>>(
      REQUESTS_KEY,
      {},
    )

    const previousOrderId = requests[body.requestId]

    if (previousOrderId) {
      const previous = orders.find(
        (order) => order.id === previousOrderId,
      )

      if (previous) {
        return HttpResponse.json(previous)
      }
    }

    const cart = readCart()

    if (cart.length === 0) {
      return failure('O carrinho está vazio', 400)
    }

    const database = getDatabase()
    const validatedItems: CartItem[] = []

    for (const item of cart) {
      const nft = database.nfts.find(
        (entry) => entry.id === item.nftId,
      )

      if (!nft) {
        return failure(
          `NFT ${item.nftId} não encontrado`,
          404,
        )
      }

      if (item.quantity > nft.available) {
        return failure(
          `Estoque insuficiente para ${nft.name}`,
          409,
        )
      }

      validatedItems.push({
        nftId: nft.id,
        name: nft.name,
        imageUrl: nft.imageUrl,
        collection: nft.collection,
        priceEth: nft.priceEth,
        quantity: item.quantity,
        available: nft.available,
      })
    }

    const totalWei = validatedItems.reduce(
      (total, item) =>
        total +
        ethToWei(item.priceEth) * BigInt(item.quantity),
      0n,
    )

    const order: Order = {
      id: crypto.randomUUID(),
      items: validatedItems,
      totalItems: validatedItems.reduce(
        (total, item) => total + item.quantity,
        0,
      ),
      totalEth: weiToEth(totalWei),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }

    try {
      // Salva o pedido antes de alterar o estoque.
      localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify([...orders, order]),
      )

      localStorage.setItem(
        REQUESTS_KEY,
        JSON.stringify({
          ...requests,
          [body.requestId]: order.id,
        }),
      )

      for (const item of validatedItems) {
        const nft = database.nfts.find(
          (entry) => entry.id === item.nftId,
        )

        if (!nft) continue

        updateNFT(nft.id, {
          available: nft.available - item.quantity,
        })
      }

      localStorage.setItem(CART_KEY, JSON.stringify([]))
    } catch {
      return failure(
        'Falha ao persistir o pedido simulado',
        500,
      )
    }

    return HttpResponse.json(order, { status: 201 })
  }),

  http.get('/api/orders/:orderId', ({ params }) => {
    const orders = readJSON<Order[]>(ORDERS_KEY, [])

    const order = orders.find(
      (entry) => entry.id === String(params.orderId),
    )

    if (!order) {
      return failure('Pedido não encontrado', 404)
    }

    return HttpResponse.json(order)
  }),
]
