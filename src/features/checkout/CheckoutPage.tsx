
import { useRef, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useCart } from '../cart/useCart'
import { useCheckout } from './useCheckout'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { data: cart, isPending, isError } = useCart()
  const checkout = useCheckout()

  const requestId = useRef<string | null>(null)
  const submitting = useRef(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function confirmOrder() {
    if (!cart || cart.items.length === 0) return
    if (submitting.current) return

    submitting.current = true
    setErrorMessage('')

    if (!requestId.current) {
      requestId.current = crypto.randomUUID()
    }

    try {
      const order = await checkout.mutateAsync({
        requestId: requestId.current,
      })

      await navigate({
        to: '/orders/$orderId',
        params: { orderId: order.id },
      })
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível confirmar o pedido.',
      )
    } finally {
      submitting.current = false
    }
  }

  if (isPending) {
    return (
      <main
        role="status"
        className="mx-auto max-w-5xl px-5 py-16"
      >
        Carregando pedido...
      </main>
    )
  }

  if (isError || !cart) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-16">
        <h1 className="text-3xl font-bold">
          Não foi possível carregar o carrinho
        </h1>
      </main>
    )
  }

  if (cart.items.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-16">
        <h1 className="text-3xl font-bold">
          Seu carrinho está vazio
        </h1>

        <p className="mt-4 text-neutral-400">
          Adicione NFTs antes de continuar.
        </p>

        <Link
          to="/cart"
          className="mt-6 inline-block rounded-lg bg-red-600 px-6 py-3"
        >
          Voltar ao carrinho
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-[70vh] max-w-5xl px-5 py-12">
      <h1 className="text-4xl font-bold">
        Finalizar pedido
      </h1>

      <p className="mt-3 text-neutral-400">
        Revise seus NFTs antes de confirmar a compra simulada.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-2">
          {cart.items.map((item) => (
            <article
              key={item.nftId}
              className="flex gap-5 rounded-xl border border-neutral-800 bg-neutral-900 p-5"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-28 w-28 rounded-lg object-cover"
              />

              <div>
                <p className="text-sm text-red-400">
                  {item.collection}
                </p>

                <h2 className="mt-2 text-lg font-semibold">
                  {item.name}
                </h2>

                <p className="mt-2 text-neutral-400">
                  Quantidade: {item.quantity}
                </p>

                <p className="mt-2 font-semibold">
                  {item.priceEth} ETH por unidade
                </p>
              </div>
            </article>
          ))}
        </section>

        <aside className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="text-xl font-bold">
            Resumo
          </h2>

          <div className="mt-6 flex justify-between">
            <span className="text-neutral-400">
              Unidades
            </span>
            <span>{cart.totalItems}</span>
          </div>

          <div className="mt-6 flex justify-between border-t border-neutral-700 pt-5">
            <span>Total estimado</span>
            <span className="text-xl font-bold">
              {cart.totalEth} ETH
            </span>
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="mt-5 rounded-lg border border-red-700 p-3 text-sm text-red-400"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="button"
            disabled={checkout.isPending}
            onClick={() => void confirmOrder()}
            className="mt-8 w-full rounded-lg bg-red-600 px-5 py-4 font-semibold hover:bg-red-700 disabled:opacity-50"
          >
            {checkout.isPending
              ? 'Confirmando...'
              : 'Confirmar pedido simulado'}
          </button>

          <Link
            to="/cart"
            className="mt-5 block text-center text-sm text-neutral-400 hover:text-white"
          >
            Voltar ao carrinho
          </Link>

          <p className="mt-6 text-xs leading-5 text-neutral-500">
            Esta é uma demonstração. Não haverá cobrança,
            transferência de criptomoedas ou emissão de NFTs
            em blockchain.
          </p>
        </aside>
      </div>
    </main>
  )
}
