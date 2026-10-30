
import { NFTCard } from './NFTCard'
import { useNFTs } from './useNFTs'
import type { NFTFilters } from '../../types/nft'

type Props = {
  filters: NFTFilters
  onPageChange: (page: number) => void
}

export function NFTCatalog({
  filters,
  onPageChange,
}: Props) {
  const {
    data,
    isPending,
    isError,
    isFetching,
    refetch,
  } = useNFTs(filters)

  if (isPending) {
    return (
      <div
        role="status"
        aria-label="Carregando NFTs"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900"
          >
            <div className="aspect-square animate-pulse bg-neutral-800" />
            <div className="h-20 animate-pulse p-5" />
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-neutral-800 p-8"
      >
        <h2 className="text-xl font-semibold">
          Não foi possível carregar os NFTs
        </h2>

        <p className="mt-3 text-neutral-400">
          Verifique a API simulada e tente novamente.
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

  if (!data || !Array.isArray(data.items)) {
    return (
      <p role="alert">
        A API retornou dados inválidos.
      </p>
    )
  }

  const currentPage = filters.page ?? 1
  const totalPages = data.totalPages

  return (
    <section aria-label="Resultados do catálogo">
      <div
        aria-live="polite"
        className="mb-6 flex flex-wrap items-center justify-between gap-2"
      >
        <p className="text-sm text-neutral-400">
          {data.total} NFTs encontrados
        </p>

        {isFetching && (
          <p className="text-sm text-neutral-400">
            Atualizando resultados...
          </p>
        )}
      </div>

      {data.items.length === 0 ? (
        <div className="rounded-xl border border-neutral-800 p-10 text-center">
          <h2 className="text-xl font-semibold">
            Nenhum NFT encontrado
          </h2>
          <p className="mt-2 text-neutral-400">
            Experimente alterar os filtros.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((nft) => (
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav
          aria-label="Paginação dos NFTs"
          className="mt-10 flex items-center justify-center gap-5"
        >
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() =>
              onPageChange(currentPage - 1)
            }
            className="rounded-lg border border-neutral-700 px-5 py-3 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Anterior
          </button>

          <span className="text-sm text-neutral-300">
            Página {currentPage} de {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() =>
              onPageChange(currentPage + 1)
            }
            className="rounded-lg border border-neutral-700 px-5 py-3 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Próxima
          </button>
        </nav>
      )}
    </section>
  )
}
