
import { useState } from 'react'
import { useNFTs } from './useNFTs'
import { NFTCard } from './NFTCard'
import type { NFTFilters } from '../../types/nft'

export function NFTCatalog() {
  const [filters] = useState<NFTFilters>({
    page: 1,
    limit: 8,
    sort: 'newest',
  })

  const { data, isPending, isError, refetch } =
    useNFTs(filters)

  if (isPending) {
    return (
      <section
        aria-label="Carregando NFTs"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900"
          >
            <div className="aspect-square animate-pulse bg-neutral-800 motion-reduce:animate-none" />
            <div className="space-y-3 p-5">
              <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-800 motion-reduce:animate-none" />
              <div className="h-6 w-3/4 animate-pulse rounded bg-neutral-800 motion-reduce:animate-none" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-neutral-800 motion-reduce:animate-none" />
            </div>
          </div>
        ))}
      </section>
    )
  }

  if (isError) {
    return (
      <div role="alert" className="rounded-xl border border-neutral-800 p-8">
        <h2 className="text-xl font-semibold">
          Não foi possível carregar os NFTs
        </h2>

        <p className="mt-2 text-neutral-400">
          Verifique sua conexão e tente novamente.
        </p>

        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-5 rounded-lg bg-red-600 px-5 py-3 text-white hover:bg-red-700"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  if (!data || data.items.length === 0) {
    return (
      <p role="status" className="py-12 text-neutral-400">
        Nenhum NFT encontrado.
      </p>
    )
  }

  return (
    <section
      aria-label="Catálogo de NFTs"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      {data.items.map((nft) => (
        <NFTCard key={nft.id} nft={nft} />
      ))}
    </section>
  )
}
