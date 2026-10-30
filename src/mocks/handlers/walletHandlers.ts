
import { http, HttpResponse } from 'msw'
import type { AuthSession } from '../../types/auth'
import type {
  Wallet,
  CreateWalletInput,
} from '../../types/wallet'

const SESSION_KEY = 'nft-marketplace-session-v1'
const WALLETS_KEY = 'nft-marketplace-wallets-v1'

function currentUserId(): string | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null

    const session = JSON.parse(raw) as AuthSession
    return session.user?.id || null
  } catch {
    return null
  }
}

function readWallets(): Wallet[] {
  try {
    const raw = localStorage.getItem(WALLETS_KEY)
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed as Wallet[] : []
  } catch {
    return []
  }
}

function saveWallets(wallets: Wallet[]) {
  localStorage.setItem(WALLETS_KEY, JSON.stringify(wallets))
}

function error(message: string, status: number) {
  return HttpResponse.json({ message }, { status })
}

export const walletHandlers = [
  http.get('/api/wallets', () => {
    const userId = currentUserId()

    if (!userId) return error('Não autenticado', 401)

    return HttpResponse.json(
      readWallets().filter(
        (wallet) => wallet.userId === userId,
      ),
    )
  }),

  http.post('/api/wallets', async ({ request }) => {
    const userId = currentUserId()

    if (!userId) return error('Não autenticado', 401)

    const body = await request.json() as CreateWalletInput
    const label = body.label?.trim()
    const address = body.address?.trim()

    if (!label || !address) {
      return error('Informe nome e endereço', 400)
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return error(
        'Endereço Ethereum inválido. Use 0x e 40 caracteres hexadecimais.',
        400,
      )
    }

    const wallets = readWallets()

    if (
      wallets.some(
        (wallet) =>
          wallet.userId === userId &&
          wallet.address.toLowerCase() === address.toLowerCase(),
      )
    ) {
      return error('Carteira já cadastrada', 409)
    }

    const wallet: Wallet = {
      id: crypto.randomUUID(),
      userId,
      label,
      address,
      createdAt: new Date().toISOString(),
    }

    saveWallets([...wallets, wallet])

    return HttpResponse.json(wallet, { status: 201 })
  }),

  http.delete('/api/wallets/:walletId', ({ params }) => {
    const userId = currentUserId()

    if (!userId) return error('Não autenticado', 401)

    const wallets = readWallets()

    const wallet = wallets.find(
      (entry) =>
        entry.id === String(params.walletId) &&
        entry.userId === userId,
    )

    if (!wallet) {
      return error('Carteira não encontrada', 404)
    }

    saveWallets(
      wallets.filter((entry) => entry.id !== wallet.id),
    )

    return HttpResponse.json({ success: true })
  }),
]
