
import { useRef, useState } from 'react'
import {
  Link,
  useNavigate,
} from '@tanstack/react-router'
import { useCart } from '../cart/useCart'
import {
  useCheckout,
  useCheckoutQuote,
} from './useCheckout'
import type { PaymentScenario } from '../../types/order'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { data: cart, isPending, isError } = useCart()
  const checkout = useCheckout()

  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState('')
  const [scenario, setScenario] =
    useState<PaymentScenario>('approved')
  const [errorMessage, setErrorMessage] = useState('')

  const quote = useCheckoutQuote(appliedCoupon)

  const requestId = useRef<string | null>(null)
  const submitting = useRef(false)

  function applyCoupon() {
    requestId.current = null
    setErrorMessage('')
    setAppliedCoupon(
      couponInput.trim().toUpperCase(),
    )
  }

  function changeScenario(value: PaymentScenario) {
    requestId.current = null
    setScenario(value)
  }

  async function confirmOrder() {
    if (
      !cart ||
      cart.items.length === 0 ||
      !quote.data ||
      submitting.current
    ) {
      return
    }

    submitting.current = true
    setErrorMessage('')

    if (!requestId.current) {
      requestId.current = crypto.randomUUID()
    }

    try {
      const order = await checkout.mutateAsync({
        requestId: requestId.current,
        couponCode: appliedCoupon,
        paymentScenario: scenario,
      })

      await navigate({
        to: '/orders/$orderId',
        params: { orderId: order.id },
      })
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível registrar o pedido.',
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
          className="mt-6 inline-block rounded-lg bg-red-600 px-6 py-3 font-semibold"
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
        Revise os valores antes de confirmar sua compra
        simulada.
      </p>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-3">
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
            Resumo financeiro
          </h2>

          <div className="mt-6">
            <label
              htmlFor="checkout-coupon"
              className="mb-2 block text-sm font-medium"
            >
              Cupom de desconto
            </label>

            <div className="flex gap-2">
              <input
                id="checkout-coupon"
                value={couponInput}
                onChange={(event) =>
                  setCouponInput(event.target.value)
                }
                placeholder="Código do cupom"
                className="min-w-0 flex-1 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-3 text-white focus-visible:outline-2 focus-visible:outline-red-400"
              />

              <button
                type="button"
                onClick={applyCoupon}
                className="rounded-lg border border-red-600 px-4 py-3 font-semibold hover:bg-red-950"
              >
                Aplicar
              </button>
            </div>

            <p className="mt-2 text-xs text-neutral-400">
              Cupom demonstrativo: JUNGLE10
            </p>
          </div>

          {quote.isPending && (
            <p role="status" className="mt-6 text-neutral-300">
              Calculando valores...
            </p>
          )}

          {quote.isError && (
            <p
              role="alert"
              className="mt-6 rounded-lg border border-red-700 p-3 text-red-300"
            >
              Não foi possível calcular o pedido.
              Verifique o cupom e o estoque.
            </p>
          )}

          {quote.data && (
            <div className="mt-6 space-y-4">
              <div className="flex justify-between gap-3">
                <span className="text-neutral-400">
                  Subtotal
                </span>
                <span>
                  {quote.data.subtotalEth} ETH
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-neutral-400">
                  Desconto
                </span>
                <span className="text-green-400">
                  − {quote.data.discountEth} ETH
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-neutral-400">
                  Taxa ({quote.data.feePercent}%)
                </span>
                <span>
                  {quote.data.feeEth} ETH
                </span>
              </div>

              <div className="border-t border-neutral-700 pt-5">
                <div className="flex justify-between gap-3">
                  <span className="font-semibold">
                    Total
                  </span>
                  <span className="text-xl font-bold">
                    {quote.data.totalEth} ETH
                  </span>
                </div>

                <p className="mt-2 text-right text-sm text-neutral-300">
                  ≈ US$ {quote.data.totalUsd}
                </p>

                <p className="mt-2 text-xs text-neutral-400">
                  Cotação fixa de demonstração:
                  1 ETH = US$ {quote.data.ethUsdRate}
                </p>
              </div>
            </div>
          )}

          <div className="mt-8">
            <label
              htmlFor="payment-scenario"
              className="mb-2 block text-sm font-medium"
            >
              Cenário de pagamento simulado
            </label>

            <select
              id="payment-scenario"
              value={scenario}
              onChange={(event) =>
                changeScenario(
                  event.target.value as PaymentScenario,
                )
              }
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-3 text-white focus-visible:outline-2 focus-visible:outline-red-400"
            >
              <option value="approved">
                Pagamento aprovado
              </option>
              <option value="pending">
                Pagamento pendente
              </option>
              <option value="rejected">
                Pagamento recusado
              </option>
            </select>
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="mt-5 rounded-lg border border-red-700 p-3 text-sm text-red-300"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="button"
            disabled={
              checkout.isPending ||
              !quote.data ||
              quote.isFetching
            }
            onClick={() => void confirmOrder()}
            className="mt-8 w-full rounded-lg bg-red-600 px-5 py-4 font-semibold hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 disabled:opacity-50"
          >
            {checkout.isPending
              ? 'Processando...'
              : 'Confirmar pedido simulado'}
          </button>

          <Link
            to="/cart"
            className="mt-5 block text-center text-sm text-neutral-300 underline underline-offset-4 hover:text-white"
          >
            Voltar ao carrinho
          </Link>

          <p className="mt-6 text-xs leading-5 text-neutral-400">
            Demonstração sem cobrança real,
            transferência de criptomoedas ou
            emissão de NFTs em blockchain.
          </p>
        </aside>
      </div>
    </main>
  )
}
