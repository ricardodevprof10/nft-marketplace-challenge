
import { http, HttpResponse, delay } from 'msw'
import {
  addUserFavorite,
  getDatabase,
  getUserFavoriteIds,
  removeUserFavorite,
} from '../store/database'
import type { AuthSession } from '../../types/auth'

const SESSION_KEY = 'nft-marketplace-session-v1'

function getAuthenticatedUserId(
  request: Request,
): string | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)

    if (!raw) return null

    const session = JSON.parse(raw) as AuthSession

    const token = request.headers
      .get('Authorization')
      ?.replace(/^Bearer\s+/i, '')
      .trim()

    if (!token || token !== session.token) {
      return null
    }

    return session.user?.id ?? null
  } catch {
    return null
  }
}

function unauthorized() {
  return HttpResponse.json(
    {
      code: 'UNAUTHORIZED',
      message: 'Faça login para acessar seus favoritos.',
    },
    { status: 401 },
  )
}

export const favoriteHandlers = [
  http.get('/api/favorites', async ({ request }) => {
    await delay(150)

    const userId = getAuthenticatedUserId(request)

    if (!userId) return unauthorized()

    const favoriteIds = getUserFavoriteIds(userId)

    const items = getDatabase().nfts.filter(
      (nft) => favoriteIds.includes(nft.id),
    )

    return HttpResponse.json({
      items,
      total: items.length,
    })
  }),

  http.post(
    '/api/favorites/:nftId',
    async ({ request, params }) => {
      await delay(150)

      const userId = getAuthenticatedUserId(request)

      if (!userId) return unauthorized()

      const nftId = String(params.nftId ?? '')

      const added = addUserFavorite(userId, nftId)

      if (!added) {
        return HttpResponse.json(
          {
            code: 'NFT_NOT_FOUND',
            message: 'NFT não encontrado.',
          },
          { status: 404 },
        )
      }

      return HttpResponse.json({
        success: true,
        nftId,
      })
    },
  ),

  http.delete(
    '/api/favorites/:nftId',
    async ({ request, params }) => {
      await delay(150)

      const userId = getAuthenticatedUserId(request)

      if (!userId) return unauthorized()

      const nftId = String(params.nftId ?? '')

      removeUserFavorite(userId, nftId)

      return HttpResponse.json({
        success: true,
        nftId,
      })
    },
  ),
]
