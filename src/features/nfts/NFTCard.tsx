
import { Link } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import type { NFT } from '../../types/nft'
import { useAuth } from '../auth/useAuth'
import {
  useFavorites,
  useFavoriteActions,
} from './useFavorites'

type NFTCardProps = {
  nft: NFT
}

export function NFTCard({ nft }: NFTCardProps) {
  const { data: user } = useAuth()
  const { data: favorites } = useFavorites()
  const { add, remove } = useFavoriteActions()

  const isFavorite =
    favorites?.items.some(
      (item) => item.id === nft.id,
    ) ?? false

  const isPending =
    add.isPending || remove.isPending

  async function toggleFavorite() {
    if (!user || isPending) return

    if (isFavorite) {
      await remove.mutateAsync(nft.id)
    } else {
      await add.mutateAsync(nft.id)
    }
  }

  return (
    <article className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
      {user && (
        <button
          type="button"
          onClick={() => void toggleFavorite()}
          disabled={isPending}
          aria-label={
            isFavorite
              ? `Remover ${nft.name} dos favoritos`
              : `Adicionar ${nft.name} aos favoritos`
          }
          aria-pressed={isFavorite}
          className="absolute right-3 top-3 z-10 rounded-full border border-neutral-700 bg-neutral-950/90 p-3 text-white transition-colors hover:border-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 disabled:opacity-50"
        >
          <Heart
            size={20}
            className={
              isFavorite
                ? 'fill-red-500 text-red-500'
                : 'text-white'
            }
            aria-hidden="true"
          />
        </button>
      )}

      <Link
        to="/nft/$nftId"
        params={{ nftId: nft.id }}
        className="block focus-visible:outline-2 focus-visible:outline-red-500"
      >
        <div className="aspect-square overflow-hidden bg-neutral-800">
          <img
            src={nft.imageUrl}
            alt={`Arte digital ${nft.name}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105 motion-reduce:transition-none"
          />
        </div>

        <div className="space-y-3 p-5">
          <p className="text-xs text-neutral-400">
            {nft.collection}
          </p>

          <h3 className="text-lg font-semibold">
            {nft.name}
          </h3>

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-neutral-400">
                Preço
              </p>

              <p className="font-semibold">
                {nft.priceEth} ETH
              </p>
            </div>

            <span className="text-xs text-neutral-400">
              {nft.available} disponíveis
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
