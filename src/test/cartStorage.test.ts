
import { describe, expect, it } from 'vitest'

const STORAGE_KEY = 'nft-marketplace-cart-v1'

interface StoredCartItem {
  nftId: string
  quantity: number
  priceEth: string
}

function saveCart(items: StoredCartItem[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(items),
  )
}

function loadCart(): StoredCartItem[] {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) return []

  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed as StoredCartItem[]
      : []
  } catch {
    return []
  }
}

describe('Persistência do carrinho', () => {
  it('inicia vazio', () => {
    expect(loadCart()).toEqual([])
  })

  it('salva um NFT', () => {
    saveCart([
      {
        nftId: 'nft-001',
        quantity: 1,
        priceEth: '0.5',
      },
    ])

    expect(loadCart()).toHaveLength(1)
    expect(loadCart()[0].nftId).toBe('nft-001')
  })

  it('preserva a quantidade', () => {
    saveCart([
      {
        nftId: 'nft-002',
        quantity: 3,
        priceEth: '1.25',
      },
    ])

    expect(loadCart()[0].quantity).toBe(3)
  })

  it('suporta valores ETH armazenados como texto', () => {
    saveCart([
      {
        nftId: 'nft-003',
        quantity: 2,
        priceEth: '0.000000000000000001',
      },
    ])

    expect(loadCart()[0].priceEth).toBe(
      '0.000000000000000001',
    )
  })

  it('retorna vazio para dados inválidos', () => {
    localStorage.setItem(
      STORAGE_KEY,
      'dados-invalidos',
    )

    expect(loadCart()).toEqual([])
  })
})
