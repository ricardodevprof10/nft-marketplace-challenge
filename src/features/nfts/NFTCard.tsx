
import { Link } from '@tanstack/react-router'
import type { NFT } from '../../types/nft'

type NFTCardProps = {
  nft: NFT
}

export function NFTCard({ nft }: NFTCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
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
