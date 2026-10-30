
import type { NFT } from '../../types/nft'
import { initialNFTs } from '../fixtures/nfts'

const STORAGE_KEY = 'nft-marketplace-mock-db-v1'

type MockDatabase = {
  nfts: NFT[]
}

function createInitialDatabase(): MockDatabase {
  return {
    nfts: structuredClone(initialNFTs),
  }
}

function isDatabase(value: unknown): value is MockDatabase {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const data = value as Partial<MockDatabase>

  return Array.isArray(data.nfts)
}

function loadDatabase(): MockDatabase {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved) {
      const parsed: unknown = JSON.parse(saved)

      if (isDatabase(parsed)) {
        return parsed
      }
    }
  } catch {
    // Recupera a fixture se o armazenamento estiver inválido.
  }

  return createInitialDatabase()
}

let database = loadDatabase()

export function getDatabase(): MockDatabase {
  return database
}

export function saveDatabase(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(database))
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
  const nft = database.nfts.find((item) => item.id === id)

  if (!nft) {
    return null
  }

  Object.assign(nft, changes)
  saveDatabase()

  return nft
}
