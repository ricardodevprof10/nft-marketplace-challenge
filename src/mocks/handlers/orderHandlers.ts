
import { http, HttpResponse } from 'msw'

import type { CartItem } from '../../types/cart'

import type {
  Order,
  CheckoutInput,
  PaymentScenario,
} from '../../types/order'

import {
  getDatabase,
  saveDatabase,
  updateNFT,
} from '../store/database'

import { calculateQuote } from '../../lib/checkout/pricing'

const CART_KEY = 'nft-marketplace-cart-v1'
const ORDERS_KEY = 'nft-marketplace-orders-v1'
const REQUESTS_KEY =
  'nft-marketplace-checkout-requests-v1'

function readJSON<T>(
  key: string,
  fallback: T,
): T {
  try {
    const raw = localStorage.getItem(key)

    return raw
      ? JSON.parse(raw) as T
      : fallback
  } catch {
    return fallback
  }
}

function failure(
  message: string,
  status: number,
) {
  return HttpResponse.json(
    { message },
    { status },
  )
}

function readCart(): CartItem[] {
  const value = readJSON<unknown>(
    CART_KEY,
    [],
  )

  if (!Array.isArray(value)) {
    return []
  }

  return value.filter(
    (item): item is CartItem => {
      if (
        !item ||
        typeof item !== 'object'
      ) {
        return false
      }

      const data =
        item as Record<string, unknown>

      return (
        typeof data.nftId === 'string' &&
        typeof data.quantity === 'number' &&
        Number.isSafeInteger(data.quantity) &&
        data.quantity > 0
      )
    },
  )
}

function validateCart(): CartItem[] {
  const cart = readCart()
  const database = getDatabase()

  if (cart.length === 0) {
    throw new Error(
      'O carrinho está vazio',
    )
  }

  const seen = new Set<string>()

  return cart.map((item) => {
    if (seen.has(item.nftId)) {
      throw new Error(
        'NFT duplicado no carrinho',
      )
    }

    seen.add(item.nftId)

    const nft = database.nfts.find(
      (entry) =>
        entry.id === item.nftId,
    )

    if (!nft) {
      throw new Error(
        'NFT não encontrado',
      )
    }

    if (item.quantity > nft.available) {
      throw new Error(
        `Estoque insuficiente para ${nft.name}`,
      )
    }

    return {
      nftId: nft.id,
      name: nft.name,
      imageUrl: nft.imageUrl,
      collection: nft.collection,
      priceEth: nft.priceEth,
      quantity: item.quantity,
      available: nft.available,
    }
  })
}

function isScenario(
  value: unknown,
): value is PaymentScenario {
  return (
    value === 'approved' ||
    value === 'pending' ||
    value === 'rejected'
  )
}

function restoreStorage(
  key: string,
  previous: string | null,
): void {
  if (previous === null) {
    localStorage.removeItem(key)
  } else {
    localStorage.setItem(
      key,
      previous,
    )
  }
}

export const orderHandlers = [
  http.get(
    '/api/checkout/quote',
    ({ request }) => {
      const url = new URL(request.url)

      const coupon =
        url.searchParams.get('coupon') ?? ''

      try {
        const items = validateCart()

        return HttpResponse.json(
          calculateQuote(
            items,
            coupon,
          ),
        )
      } catch (error) {
        return failure(
          error instanceof Error
            ? error.message
            : 'Não foi possível calcular o pedido',
          400,
        )
      }
    },
  ),

  http.post(
    '/api/checkout',
    async ({ request }) => {
      let body: CheckoutInput

      try {
        body =
          await request.json() as CheckoutInput
      } catch {
        return failure(
          'Requisição inválida',
          400,
        )
      }

      if (
        !body ||
        typeof body.requestId !== 'string' ||
        body.requestId.length < 8 ||
        (
          body.couponCode !== undefined &&
          typeof body.couponCode !== 'string'
        ) ||
        (
          body.paymentScenario !== undefined &&
          !isScenario(body.paymentScenario)
        )
      ) {
        return failure(
          'Dados do checkout inválidos',
          400,
        )
      }

      const orders = readJSON<Order[]>(
        ORDERS_KEY,
        [],
      )

      const requests = readJSON<
        Record<string, string>
      >(
        REQUESTS_KEY,
        {},
      )

      const previousId =
        requests[body.requestId]

      if (previousId) {
        const previous = orders.find(
          (order) =>
            order.id === previousId,
        )

        if (previous) {
          return HttpResponse.json(
            previous,
          )
        }

        return failure(
          'Tentativa anterior inconsistente',
          409,
        )
      }

      let items: CartItem[]
      let quote

      try {
        items = validateCart()

        quote = calculateQuote(
          items,
          body.couponCode,
        )
      } catch (error) {
        return failure(
          error instanceof Error
            ? error.message
            : 'Pedido inválido',
          409,
        )
      }

      const scenario =
        body.paymentScenario ?? 'approved'

      const status =
        scenario === 'approved'
          ? 'confirmed'
          : scenario === 'pending'
            ? 'pending'
            : 'rejected'

      const order: Order = {
        id: crypto.randomUUID(),
        items,
        totalItems: items.reduce(
          (sum, item) =>
            sum + item.quantity,
          0,
        ),
        totalEth: quote.totalEth,
        quote,
        status,
        createdAt:
          new Date().toISOString(),
        version: 1,
        nftVersions: {},
      }

      const previousOrdersRaw =
        localStorage.getItem(ORDERS_KEY)

      const previousRequestsRaw =
        localStorage.getItem(REQUESTS_KEY)

      const previousCartRaw =
        localStorage.getItem(CART_KEY)

      // Preserva os valores e versões anteriores
      // para recuperação em caso de falha.
      const stockSnapshot = items.map(
        (item) => {
          const nft =
            getDatabase().nfts.find(
              (entry) =>
                entry.id === item.nftId,
            )

          return {
            nftId: item.nftId,
            available:
              nft?.available ?? 0,
            version: nft?.version,
          }
        },
      )

      try {
        if (status === 'confirmed') {
          for (const item of items) {
            const nft =
              getDatabase().nfts.find(
                (entry) =>
                  entry.id === item.nftId,
              )

            if (!nft) {
              throw new Error(
                'NFT indisponível',
              )
            }

            const updated = updateNFT(
              nft.id,
              {
                available:
                  nft.available -
                  item.quantity,
              },
            )

            if (!updated) {
              throw new Error(
                'Falha ao atualizar NFT',
              )
            }

            order.nftVersions![
              updated.id
            ] = updated.version ?? 1
          }
        }

        localStorage.setItem(
          ORDERS_KEY,
          JSON.stringify([
            ...orders,
            order,
          ]),
        )

        localStorage.setItem(
          REQUESTS_KEY,
          JSON.stringify({
            ...requests,
            [body.requestId]:
              order.id,
          }),
        )

        if (status === 'confirmed') {
          localStorage.setItem(
            CART_KEY,
            JSON.stringify([]),
          )
        }
      } catch {
        try {
          for (
            const snapshot of stockSnapshot
          ) {
            const nft =
              getDatabase().nfts.find(
                (entry) =>
                  entry.id ===
                  snapshot.nftId,
              )

            if (nft) {
              nft.available =
                snapshot.available

              nft.version =
                snapshot.version
            }
          }

          saveDatabase()

          restoreStorage(
            ORDERS_KEY,
            previousOrdersRaw,
          )

          restoreStorage(
            REQUESTS_KEY,
            previousRequestsRaw,
          )

          restoreStorage(
            CART_KEY,
            previousCartRaw,
          )
        } catch {
          // O ambiente mock não garante
          // transações atômicas em falhas
          // de armazenamento.
        }

        return failure(
          'Falha ao persistir o pedido simulado',
          500,
        )
      }

      return HttpResponse.json(
        order,
        { status: 201 },
      )
    },
  ),

  http.get(
    '/api/orders/:orderId',
    ({ params }) => {
      const orders = readJSON<Order[]>(
        ORDERS_KEY,
        [],
      )

      const order = orders.find(
        (entry) =>
          entry.id ===
          String(params.orderId),
      )

      if (!order) {
        return failure(
          'Pedido não encontrado',
          404,
        )
      }

      return HttpResponse.json(order)
    },
  ),
]
