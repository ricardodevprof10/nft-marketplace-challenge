
import { Link, useParams } from '@tanstack/react-router'
import { useOrder } from './useCheckout'

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
        Carregando comprovante...
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
          className="mt-6 inline-block text-red-400"
        >
          Voltar ao carrinho
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-[70vh] max-w-5xl px-5 py-12">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8">
        <div className="mb-8">
          <p className="font-semibold text-green-400">
            ✓ Pedido confirmado
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Compra simulada concluída
          </h1>

          <p className="mt-3 text-neutral-400">
            Seu pedido foi registrado no ambiente de demonstração.
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
            {new Date(order.createdAt).toLocaleString('pt-BR')}
          </p>

          <p>
            <span className="text-neutral-400">
              Status:
            </span>{' '}
            Confirmado
          </p>
        </div>

        <h2 className="mt-8 text-xl font-bold">
          NFTs adquiridos
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

        <div className="mt-8 flex justify-between border-t border-neutral-800 pt-6">
          <span className="text-lg font-semibold">
            Total registrado
          </span>

          <span className="text-2xl font-bold">
            {order.totalEth} ETH
          </span>
        </div>

        <p className="mt-6 text-xs text-neutral-500">
          Comprovante de demonstração, sem validade financeira
          ou registro em blockchain.
        </p>

        <Link
          to="/"
          search={{
            search: '',
            category: '',
            sort: 'newest',
            page: 1,
          }}
          className="mt-8 inline-block rounded-lg bg-red-600 px-6 py-3 font-semibold hover:bg-red-700"
        >
          Continuar explorando
        </Link>
      </div>
    </main>
  )
}
