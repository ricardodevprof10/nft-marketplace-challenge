
import type { NFTFilters as Filters } from '../../types/nft'

type Props = {
  filters: Filters
  onChange: (changes: Partial<Filters>) => void
}

export function NFTFilters({ filters, onChange }: Props) {
  return (
    <section
      aria-label="Filtros de NFTs"
      className="mb-8 grid gap-4 md:grid-cols-3"
    >
      <div>
        <label
          htmlFor="nft-search"
          className="mb-2 block text-sm text-neutral-300"
        >
          Buscar NFTs
        </label>

        <input
          id="nft-search"
          type="search"
          value={filters.search ?? ''}
          onChange={(event) =>
            onChange({
              search: event.target.value,
              page: 1,
            })
          }
          placeholder="Nome, coleção ou criador"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white outline-none focus:border-red-500"
        />
      </div>

      <div>
        <label
          htmlFor="nft-category"
          className="mb-2 block text-sm text-neutral-300"
        >
          Categoria
        </label>

        <select
          id="nft-category"
          value={filters.category ?? ''}
          onChange={(event) =>
            onChange({
              category: event.target.value,
              page: 1,
            })
          }
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white"
        >
          <option value="">Todas as categorias</option>
          <option value="Arte">Arte</option>
          <option value="Música">Música</option>
          <option value="Fotografia">Fotografia</option>
          <option value="Colecionáveis">Colecionáveis</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="nft-sort"
          className="mb-2 block text-sm text-neutral-300"
        >
          Ordenar por
        </label>

        <select
          id="nft-sort"
          value={filters.sort ?? 'newest'}
          onChange={(event) =>
            onChange({
              sort: event.target.value as Filters['sort'],
              page: 1,
            })
          }
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white"
        >
          <option value="newest">Mais recentes</option>
          <option value="price_asc">Menor preço</option>
          <option value="price_desc">Maior preço</option>
        </select>
      </div>
    </section>
  )
}
