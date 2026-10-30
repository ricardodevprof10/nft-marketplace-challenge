
import { useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { useNFTDetail } from './useNFTDetail'
import { Button } from '../../components/ui/button'

export function NFTDetailPage() {
  const { nftId } = useParams({
    from: '/nft/$nftId',
  })

  const {
    data: nft,
    isPending,
    isError,
    refetch,
  } = useNFTDetail(nftId)

  const [quantity, setQuantity] = useState(1)

  if (isPending) {
    return (
      <main
        role="status"
        className="mx-auto max-w-7xl px-5 py-12"
      >
        <div className="grid animate-pulse gap-10 md:grid-cols-2">
          <div className="aspect-square rounded-xl bg-neutral-800" />
          <div className="space-y-5">
            <div className="h-10 rounded bg-neutral-800" />
            <div className="h-6 w-2/3 rounded bg-neutral-800" />
            <div className="h-32 rounded bg-neutral-800" />
          </div>
        </div>
      </main>
    )
  }

  if (isError || !nft) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-16">
        <h1 className="text-3xl font-bold">
          NFT não encontrado
        </h1>

        <p className="mt-4 text-neutral-400">
          Não foi possível carregar os detalhes deste NFT.
        </p>

        <div className="mt-6 flex gap-4">
          <Button
            onClick={() => void refetch()}
          >
            Tentar novamente
          </Button>

          <Button variant="outline" asChild>
            <Link
              to="/"
              search={{
                search: '',
                category: '',
                sort: 'newest',
                page: 1,
              }}
            >
              Voltar ao catálogo
            </Link>
          </Button>
        </div>
      </main>
    )
  }

  const isSoldOut = nft.available <= 0

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1))
  }

  const increaseQuantity = () => {
    setQuantity((current) =>
      Math.min(nft.available, current + 1),
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <Link
        to="/"
        search={{
          search: '',
          category: '',
          sort: 'newest',
          page: 1,
        }}
        className="mb-8 inline-block text-sm text-neutral-400 hover:text-white"
      >
        ← Voltar ao catálogo
      </Link>

      <div className="grid items-start gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
          <img
            src={nft.imageUrl}
            alt={`Arte digital ${nft.name}`}
            className="aspect-square w-full object-cover"
          />
        </div>

        <section className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-red-500">
              {nft.collection}
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              {nft.name}
            </h1>

            <p className="mt-3 text-neutral-400">
              Criado por {nft.creator}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="rounded-full border border-neutral-700 px-4 py-2 text-sm">
              {nft.category}
            </span>

            <span className="rounded-full border border-neutral-700 px-4 py-2 text-sm">
              Edição: {nft.edition}
            </span>
          </div>

          <div className="border-y border-neutral-800 py-6">
            <p className="text-sm text-neutral-400">
              Preço por unidade
            </p>

            <p className="mt-2 text-3xl font-bold">
              {nft.priceEth} ETH
            </p>

            <p className="mt-3 text-sm text-neutral-400">
              {isSoldOut
                ? 'Esgotado'
                : `${nft.available} unidades disponíveis`}
            </p>
          </div>

          {!isSoldOut && (
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Quantidade
              </label>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  aria-label="Diminuir quantidade"
                >
                  −
                </Button>

                <span
                  aria-live="polite"
                  className="min-w-10 text-center text-lg font-semibold"
                >
                  {quantity}
                </span>

                <Button
                  variant="outline"
                  onClick={increaseQuantity}
                  disabled={quantity >= nft.available}
                  aria-label="Aumentar quantidade"
                >
                  +
                </Button>
              </div>
            </div>
          )}

          <Button
            size="lg"
            className="w-full"
            disabled
          >
            {isSoldOut
              ? 'NFT esgotado'
              : 'Adicionar ao carrinho — em desenvolvimento'}
          </Button>

          <p className="text-xs text-neutral-500">
            A integração com o carrinho será implementada
            na próxima etapa. Nenhuma compra real é realizada.
          </p>
        </section>
      </div>

      <section className="mt-14 border-t border-neutral-800 pt-10">
        <h2 className="text-2xl font-bold">
          Sobre este NFT
        </h2>

        <p className="mt-4 max-w-3xl leading-7 text-neutral-400">
          {nft.description}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-800 p-5">
            <p className="text-sm text-neutral-400">
              Identificador
            </p>
            <p className="mt-2 font-semibold">
              #{nft.id}
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 p-5">
            <p className="text-sm text-neutral-400">
              Coleção
            </p>
            <p className="mt-2 font-semibold">
              {nft.collection}
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 p-5">
            <p className="text-sm text-neutral-400">
              Disponibilidade
            </p>
            <p className="mt-2 font-semibold">
              {nft.available}
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
