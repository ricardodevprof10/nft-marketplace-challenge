
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useCart, useCartActions } from './useCart'

const catalogSearch = {
  search: '',
  category: '',
  sort: 'newest' as const,
  page: 1,
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Não foi possível concluir a operação.'
}

export function CartPage() {
  const { data: cart, isPending, isError, refetch } = useCart()

  const { updateItem, removeItem, clearCart } =
    useCartActions()

  const [message, setMessage] = useState('')

  const isMutating =
    updateItem.isPending ||
    removeItem.isPending ||
    clearCart.isPending

  async function changeQuantity(
    nftId: string,
    quantity: number,
  ) {
    setMessage('')

    try {
      await updateItem.mutateAsync({ nftId, quantity })
    } catch (error) {
      setMessage(getErrorMessage(error))
    }
  }

  async function remove(nftId: string) {
    setMessage('')

    try {
      await removeItem.mutateAsync(nftId)
    } catch (error) {
      setMessage(getErrorMessage(error))
    }
  }

  async function clear() {
    setMessage('')

    try {
      await clearCart.mutateAsync()
    } catch (error) {
      setMessage(getErrorMessage(error))
    }
  }

  if (isPending) {
    return (
      <main
        role="status"
        className="mx-auto max-w-7xl px-5 py-16"
      >
        Carregando carrinho...
      </main>
    )
  }

  if (isError || !cart) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-16">
        <h1 className="text-3xl font-bold">
          Erro ao carregar o carrinho
        </h1>

        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-6 rounded-lg bg-red-600 px-5 py-3"
        >
          Tentar novamente
        </button>
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Meu carrinho
        </h1>

        <p className="mt-3 text-neutral-400">
          {cart.totalItems} unidades selecionadas
        </p>
      </div>

      {message && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-red-700 bg-red-950 p-4 text-red-200"
        >
          {message}
        </div>
      )}

      {cart.items.length === 0 ? (
        <section className="rounded-xl border border-neutral-800 p-10 text-center">
          <h2 className="text-2xl font-semibold">
            Seu carrinho está vazio
          </h2>

          <p className="mt-3 text-neutral-400">
            Explore o catálogo e escolha seus NFTs.
          </p>

          <Link
            to="/"
            search={catalogSearch}
            className="mt-6 inline-block rounded-lg bg-red-600 px-6 py-3 font-medium hover:bg-red-700"
          >
            Explorar NFTs
          </Link>
        </section>
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-3">
          <section
            aria-label="Itens do carrinho"
            className="space-y-5 lg:col-span-2"
          >
            {cart.items.map((item) => (
              <article
                key={item.nftId}
                className="flex flex-col gap-5 rounded-xl border border-neutral-800 bg-neutral-900 p-5 sm:flex-row"
              >
                <Link
                  to="/nft/$nftId"
                  params={{ nftId: item.nftId }}
                  className="shrink-0"
                >
                  <img
                    src={item.imageUrl}
                    alt={`Arte digital ${item.name}`}
                    className="h-40 w-full rounded-lg object-cover sm:w-40"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <p className="text-sm text-red-400">
                    {item.collection}
                  </p>

                  <Link
                    to="/nft/$nftId"
                    params={{ nftId: item.nftId }}
                    className="mt-2 block text-xl font-semibold hover:text-red-400"
                  >
                    {item.name}
                  </Link>

                  <p className="mt-2 font-bold">
                    {item.priceEth} ETH
                  </p>

                  <p className="mt-2 text-xs text-neutral-400">
                    {item.available} disponíveis
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      disabled={
                        isMutating ||
                        item.quantity <= 1
                      }
                      onClick={() =>
                        void changeQuantity(
                          item.nftId,
                          item.quantity - 1,
                        )
                      }
                      aria-label={`Diminuir quantidade de ${item.name}`}
                      className="rounded-lg border border-neutral-700 px-4 py-2 disabled:opacity-40"
                    >
                      −
                    </button>

                    <span
                      aria-live="polite"
                      className="min-w-8 text-center font-semibold"
                    >
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      disabled={
                        isMutating ||
                        item.quantity >= item.available
                      }
                      onClick={() =>
                        void changeQuantity(
                          item.nftId,
                          item.quantity + 1,
                        )
                      }
                      aria-label={`Aumentar quantidade de ${item.name}`}
                      className="rounded-lg border border-neutral-700 px-4 py-2 disabled:opacity-40"
                    >
                      +
                    </button>

                    <button
                      type="button"
                      disabled={isMutating}
                      onClick={() => void remove(item.nftId)}
                      className="ml-auto text-sm text-red-400 hover:text-red-300 disabled:opacity-40"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <aside className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-xl font-bold">
              Resumo do pedido
            </h2>

            <div className="mt-6 flex justify-between text-neutral-300">
              <span>Quantidade</span>
              <span>{cart.totalItems}</span>
            </div>

            <div className="mt-5 flex justify-between border-t border-neutral-700 pt-5">
              <span className="font-semibold">
                Total
              </span>

              <span className="text-xl font-bold">
                {cart.totalEth} ETH
              </span>
            </div>

            <Link
              to="/checkout"
              aria-disabled={isMutating}
              onClick={(event) => {
                if (isMutating) event.preventDefault()
              }}
              className="mt-8 block w-full rounded-lg bg-red-600 px-5 py-3 text-center font-semibold hover:bg-red-700"
            >
              Continuar para checkout
            </Link>

            <button
              type="button"
              disabled={isMutating}
              onClick={() => void clear()}
              className="mt-4 w-full rounded-lg border border-neutral-700 px-5 py-3 text-sm hover:border-red-500 disabled:opacity-40"
            >
              Esvaziar carrinho
            </button>

            <p className="mt-5 text-xs leading-5 text-neutral-500">
              Ambiente de demonstração. Nenhuma transação
              financeira ou operação blockchain é realizada.
            </p>
          </aside>
        </div>
      )}
    </main>
  )
}
