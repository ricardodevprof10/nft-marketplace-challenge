
import { Link, useParams } from '@tanstack/react-router'
import { useOrder } from './useCheckout'

const catalogSearch = {
  search: '',
  category: '',
  sort: 'newest' as const,
  page: 1,
}

export function OrderDetailPage() {
  const { orderId } = useParams({
    from: '/orders/$orderId',
  })

  const { data: order, isPending, isError } =
    useOrder(orderId)

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

  if (isError || !order) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-16">
        <h1 className="text-3xl font-bold">
          Pedido não encontrado
        </h1>

        <Link
          to="/cart"
          className="mt-6 inline-block text-red-400 underline"
        >
          Voltar ao carrinho
        </Link>
      </main>
    )
  }

  const status = order.status ?? 'confirmed'

  const statusLabel =
    status === 'confirmed'
      ? 'Confirmado'
      : status === 'pending'
        ? 'Pendente'
        : 'Recusado'

  const statusColor =
    status === 'confirmed'
      ? 'text-green-400'
      : status === 'pending'
        ? 'text-amber-400'
        : 'text-red-400'

  const title =
    status === 'confirmed'
      ? 'Compra simulada concluída'
      : status === 'pending'
        ? 'Pedido aguardando pagamento'
        : 'Pagamento simulado recusado'

  const description =
    status === 'confirmed'
      ? 'Seu pedido foi registrado e o estoque foi atualizado.'
      : status === 'pending'
        ? 'O pedido foi registrado, mas ainda não foi aprovado. Nenhum estoque foi descontado.'
        : 'O pagamento foi recusado na simulação. Nenhum estoque foi descontado.'

  return (
    <main className="mx-auto min-h-[70vh] max-w-5xl px-5 py-12">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8">
        <div className="mb-8">
          <p
            role="status"
            className={`font-semibold ${statusColor}`}
          >
            Pedido {statusLabel.toLowerCase()}
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            {title}
          </h1>

          <p className="mt-3 text-neutral-300">
            {description}
          </p>
        </div>

        <div className="space-y-3 border-y border-neutral-800 py-6 text-sm">
          <p className="break-all">
            <span className="text-neutral-400">
              Pedido:
            </span>{' '}
            {order.id}
          </p>

          <p>
            <span className="text-neutral-400">
              Data:
            </span>{' '}
            {new Date(order.createdAt).toLocaleString(
              'pt-BR',
            )}
          </p>

          <p>
            <span className="text-neutral-400">
              Status:
            </span>{' '}
            <span className={statusColor}>
              {statusLabel}
            </span>
          </p>
        </div>

        <h2 className="mt-8 text-xl font-bold">
          NFTs do pedido
        </h2>

        <div className="mt-5 space-y-4">
          {order.items.map((item) => (
            <article
              key={item.nftId}
              className="flex items-center gap-4 rounded-lg border border-neutral-800 p-4"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-20 w-20 rounded-lg object-cover"
              />

              <div>
                <h3 className="font-semibold">
                  {item.name}
                </h3>

                <p className="mt-1 text-sm text-neutral-400">
                  {item.quantity} unidade(s)
                </p>

                <p className="mt-1 text-sm">
                  {item.priceEth} ETH por unidade
                </p>
              </div>
            </article>
          ))}
        </div>

        {order.quote && (
          <div className="mt-8 space-y-3 border-t border-neutral-800 pt-6">
            <div className="flex justify-between gap-3">
              <span className="text-neutral-300">
                Subtotal
              </span>
              <span>
                {order.quote.subtotalEth} ETH
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-neutral-300">
                Desconto
              </span>
              <span className="text-green-400">
                − {order.quote.discountEth} ETH
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-neutral-300">
                Taxa ({order.quote.feePercent}%)
              </span>
              <span>
                {order.quote.feeEth} ETH
              </span>
            </div>

            {order.quote.couponCode && (
              <p className="text-sm text-neutral-300">
                Cupom utilizado:{' '}
                {order.quote.couponCode}
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800 pt-6">
          <span className="text-lg font-semibold">
            Total registrado
          </span>

          <span className="text-2xl font-bold">
            {order.totalEth} ETH
          </span>
        </div>

        {order.quote && (
          <p className="mt-2 text-right text-sm text-neutral-300">
            Aproximadamente US$ {order.quote.totalUsd}
            {' '}— cotação demonstrativa
          </p>
        )}

        <p className="mt-6 text-xs text-neutral-400">
          Comprovante de demonstração, sem validade
          financeira ou registro em blockchain.
        </p>

        <Link
          to="/"
          search={catalogSearch}
          className="mt-8 inline-block rounded-lg bg-red-600 px-6 py-3 font-semibold hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
        >
          Continuar explorando
        </Link>
      </div>
    </main>
  )
}
