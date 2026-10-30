
import { Link } from '@tanstack/react-router'
import { Heart, LoaderCircle } from 'lucide-react'
import { NFTCard } from './NFTCard'
import { useFavorites } from './useFavorites'

const defaultSearch = {
  search: '',
  category: '',
  sort: 'newest' as const,
  page: 1,
}

export function FavoritesPage() {
  const {
    data,
    isPending,
    isError,
    refetch,
  } = useFavorites()

  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-12">
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <Heart
            size={30}
            className="text-red-500"
            aria-hidden="true"
          />

          <h1 className="text-3xl font-bold sm:text-4xl">
            Meus favoritos
          </h1>
        </div>

        <p className="max-w-2xl text-neutral-400">
          Consulte os NFTs que você salvou em sua
          coleção de favoritos.
        </p>
      </div>

      {isPending && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-neutral-300"
        >
          <LoaderCircle
            className="animate-spin text-red-500"
            size={22}
            aria-hidden="true"
          />

          <span>Carregando seus favoritos...</span>
        </div>
      )}

      {isError && (
        <div
          role="alert"
          className="rounded-xl border border-red-900 bg-neutral-900 p-6"
        >
          <h2 className="text-lg font-semibold">
            Não foi possível carregar os favoritos
          </h2>

          <p className="mt-2 text-neutral-300">
            Verifique sua conexão e tente novamente.
          </p>

          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-5 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {data && data.items.length === 0 && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-6 py-12 text-center">
          <Heart
            size={40}
            className="mx-auto text-neutral-400"
            aria-hidden="true"
          />

          <h2 className="mt-5 text-xl font-semibold">
            Você ainda não possui favoritos
          </h2>

          <p className="mx-auto mt-3 max-w-md text-neutral-400">
            Explore o marketplace e selecione o coração
            dos NFTs que deseja acompanhar.
          </p>

          <Link
            to="/"
            search={defaultSearch}
            className="mt-6 inline-flex rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
          >
            Explorar NFTs
          </Link>
        </div>
      )}

      {data && data.items.length > 0 && (
        <>
          <p className="mb-6 text-sm text-neutral-400">
            {data.total}{' '}
            {data.total === 1
              ? 'NFT salvo'
              : 'NFTs salvos'}
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.items.map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        </>
      )}
    </main>
  )
}
