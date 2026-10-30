
import type { NFT } from '../../types/nft'
import { initialNFTs } from '../fixtures/nfts'

const STORAGE_KEY = 'nft-marketplace-mock-db-v1'

export type MockDatabase = {
  nfts: NFT[]
  favoritesByUser: Record<string, string[]>
}

function createInitialDatabase(): MockDatabase {
  return {
    nfts: structuredClone(initialNFTs),
    favoritesByUser: {},
  }
}

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  )
}

function isDatabase(
  value: unknown,
): value is MockDatabase {
  return isRecord(value) && Array.isArray(value.nfts)
}

function normalizeFavorites(
  value: unknown,
): Record<string, string[]> {
  if (!isRecord(value)) {
    return {}
  }

  const result: Record<string, string[]> = {}

  for (const [userId, nftIds] of Object.entries(value)) {
    if (
      !userId.trim() ||
      !Array.isArray(nftIds)
    ) {
      continue
    }

    result[userId] = [
      ...new Set(
        nftIds.filter(
          (id): id is string =>
            typeof id === 'string' &&
            id.trim().length > 0,
        ),
      ),
    ]
  }

  return result
}

function loadDatabase(): MockDatabase {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved) {
      const parsed: unknown = JSON.parse(saved)

      if (isDatabase(parsed)) {
        return {
          nfts: parsed.nfts,
          favoritesByUser: normalizeFavorites(
            parsed.favoritesByUser,
          ),
        }
      }
    }
  } catch {
    // Recupera os dados iniciais quando o armazenamento
    // estiver indisponível ou contiver JSON inválido.
  }

  return createInitialDatabase()
}

let database = loadDatabase()

export function getDatabase(): MockDatabase {
  return database
}

export function saveDatabase(): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(database),
  )
}

export function resetDatabase(): MockDatabase {
  database = createInitialDatabase()
  saveDatabase()

  return database
}

export function updateNFT(
  id: string,
  changes: Partial<NFT>,
): NFT | null {
  const nft = database.nfts.find(
    (item) => item.id === id,
  )

  if (!nft) {
    return null
  }

  Object.assign(nft, changes)
  saveDatabase()

  return nft
}

export function getUserFavoriteIds(
  userId: string,
): string[] {
  if (!userId.trim()) {
    return []
  }

  return [
    ...(database.favoritesByUser[userId] ?? []),
  ]
}

export function addUserFavorite(
  userId: string,
  nftId: string,
): boolean {
  if (!userId.trim() || !nftId.trim()) {
    return false
  }

  const nftExists = database.nfts.some(
    (item) => item.id === nftId,
  )

  if (!nftExists) {
    return false
  }

  const current = getUserFavoriteIds(userId)

  if (!current.includes(nftId)) {
    database.favoritesByUser[userId] = [
      ...current,
      nftId,
    ]

    saveDatabase()
  }

  return true
}

export function removeUserFavorite(
  userId: string,
  nftId: string,
): void {
  if (!userId.trim() || !nftId.trim()) {
    return
  }

  const current = getUserFavoriteIds(userId)

  database.favoritesByUser[userId] =
    current.filter((id) => id !== nftId)

  saveDatabase()
}
