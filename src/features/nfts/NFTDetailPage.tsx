
import { useEffect, useState } from 'react'
import {
  Link,
  useNavigate,
  useParams,
} from '@tanstack/react-router'

import { useNFTDetail } from './useNFTDetail'
import { useCartActions } from '../cart/useCart'

const catalogSearch = {
  search: '',
  category: '',
  sort: 'newest' as const,
  page: 1,
}

export function NFTDetailPage() {
  const { nftId } = useParams({
    from: '/nft/$nftId',
  })

  const navigate = useNavigate()

  const {
    data: nft,
    isPending,
    isError,
    refetch,
  } = useNFTDetail(nftId)

  const { addItem } = useCartActions()

  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setQuantity(1)
    setMessage('')
  }, [nftId])

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

        <div className="mt-6 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-lg bg-red-600 px-5 py-3"
          >
            Tentar novamente
          </button>

          <Link
            to="/"
            search={catalogSearch}
            className="rounded-lg border border-neutral-700 px-5 py-3"
          >
            Voltar ao catálogo
          </Link>
        </div>
      </main>
    )
  }

  const isSoldOut = nft.available <= 0

  async function handleAddToCart() {
    if (!nft || isSoldOut) return

    setMessage('')

    try {
      await addItem.mutateAsync({
        nftId: nft.id,
        name: nft.name,
        imageUrl: nft.imageUrl,
        collection: nft.collection,
        priceEth: nft.priceEth,
        quantity,
        available: nft.available,
      })

      await navigate({ to: '/cart' })
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível adicionar ao carrinho.',
      )
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <Link
        to="/"
        search={catalogSearch}
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
                <button
                  type="button"
                  disabled={quantity <= 1 || addItem.isPending}
                  onClick={() =>
                    setQuantity((current) =>
                      Math.max(1, current - 1),
                    )
                  }
                  className="rounded-lg border border-neutral-700 px-5 py-3 disabled:opacity-40"
                >
                  −
                </button>

                <span
                  aria-live="polite"
                  className="min-w-10 text-center text-lg font-semibold"
                >
                  {quantity}
                </span>

                <button
                  type="button"
                  disabled={
                    quantity >= nft.available ||
                    addItem.isPending
                  }
                  onClick={() =>
                    setQuantity((current) =>
                      Math.min(nft.available, current + 1),
                    )
                  }
                  className="rounded-lg border border-neutral-700 px-5 py-3 disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {message && (
            <p
              role="alert"
              className="rounded-lg border border-red-700 p-4 text-red-400"
            >
              {message}
            </p>
          )}

          <button
            type="button"
            onClick={() => void handleAddToCart()}
            disabled={isSoldOut || addItem.isPending}
            className="w-full rounded-lg bg-red-600 px-6 py-4 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSoldOut
              ? 'NFT esgotado'
              : addItem.isPending
                ? 'Adicionando...'
                : 'Adicionar ao carrinho'}
          </button>

          <p className="text-xs text-neutral-500">
            Compra simulada. Nenhuma transação real é realizada.
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
