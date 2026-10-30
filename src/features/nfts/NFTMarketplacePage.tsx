
import {
  useNavigate,
  useSearch,
} from '@tanstack/react-router'

import { NFTCatalog } from './NFTCatalog'
import { NFTFilters } from './NFTFilters'
import type { NFTFilters as Filters } from '../../types/nft'

export function NFTMarketplacePage() {
  const search = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })

  const filters: Filters = {
    search: search.search,
    category: search.category,
    sort: search.sort,
    page: search.page,
    limit: 8,
  }

  function updateFilters(changes: Partial<Filters>) {
    void navigate({
      to: '/',
      search: (previous) => ({
        ...previous,
        ...changes,
      }),
      replace: changes.search !== undefined,
    })
  }

  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-12">
      <header className="mb-10">
        <p className="mb-3 text-sm font-semibold text-red-500">
          NFT Marketplace
        </p>

        <h1 className="text-4xl font-bold md:text-5xl">
          Explore NFTs
        </h1>

        <p className="mt-4 text-neutral-400">
          Descubra coleções digitais e novas oportunidades.
        </p>
      </header>

      <NFTFilters
        filters={filters}
        onChange={updateFilters}
      />

      <NFTCatalog
        filters={filters}
        onPageChange={(page) =>
          updateFilters({ page })
        }
      />
    </main>
  )
}
