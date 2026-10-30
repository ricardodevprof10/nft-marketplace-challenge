
import { useState } from 'react'
import { useWallets, useWalletActions } from './useWallets'

export function WalletsPage() {
  const {
    data: wallets,
    isPending,
    isError,
    refetch,
  } = useWallets()

  const { create, remove } = useWalletActions()

  const [label, setLabel] = useState('')
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState('')

  async function handleCreate(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setMessage('')

    try {
      await create.mutateAsync({
        label,
        address,
      })

      setLabel('')
      setAddress('')
    } catch {
      setMessage(
        'Não foi possível cadastrar. Verifique o endereço ou se ele já existe.',
      )
    }
  }

  async function handleRemove(walletId: string) {
    setMessage('')

    try {
      await remove.mutateAsync(walletId)
    } catch {
      setMessage('Não foi possível remover a carteira.')
    }
  }

  const busy = create.isPending || remove.isPending

  return (
    <main className="mx-auto min-h-[70vh] max-w-5xl px-5 py-12">
      <h1 className="text-4xl font-bold">
        Minhas carteiras
      </h1>

      <p className="mt-3 text-neutral-400">
        Gerencie endereços públicos Ethereum para demonstração.
      </p>

      <section className="mt-10 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="text-xl font-semibold">
          Adicionar carteira
        </h2>

        <form
          onSubmit={(event) => void handleCreate(event)}
          className="mt-6 space-y-5"
        >
          <div>
            <label
              htmlFor="wallet-label"
              className="mb-2 block text-sm"
            >
              Nome da carteira
            </label>

            <input
              id="wallet-label"
              required
              maxLength={60}
              value={label}
              onChange={(event) =>
                setLabel(event.target.value)
              }
              placeholder="Minha carteira de teste"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label
              htmlFor="wallet-address"
              className="mb-2 block text-sm"
            >
              Endereço público Ethereum
            </label>

            <input
              id="wallet-address"
              required
              value={address}
              onChange={(event) =>
                setAddress(event.target.value)
              }
              placeholder="0x..."
              spellCheck={false}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 font-mono text-sm outline-none focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-red-600 px-6 py-3 font-semibold hover:bg-red-700 disabled:opacity-50"
          >
            {create.isPending
              ? 'Salvando...'
              : 'Adicionar carteira'}
          </button>
        </form>

        <p className="mt-5 text-xs leading-5 text-neutral-500">
          Informe somente endereços públicos fictícios ou
          destinados a testes. Nunca insira chaves privadas
          ou frases de recuperação.
        </p>
      </section>

      {message && (
        <p
          role="alert"
          className="mt-6 rounded-lg border border-red-700 p-4 text-red-400"
        >
          {message}
        </p>
      )}

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">
          Carteiras cadastradas
        </h2>

        {isPending ? (
          <p role="status" className="mt-6 text-neutral-400">
            Carregando carteiras...
          </p>
        ) : isError ? (
          <div className="mt-6">
            <p className="text-red-400">
              Não foi possível carregar as carteiras.
            </p>

            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 rounded-lg border border-neutral-700 px-5 py-3"
            >
              Tentar novamente
            </button>
          </div>
        ) : !wallets?.length ? (
          <div className="mt-6 rounded-xl border border-neutral-800 p-8">
            <p className="text-neutral-400">
              Nenhuma carteira cadastrada.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {wallets.map((wallet) => (
              <article
                key={wallet.id}
                className="flex flex-col gap-4 rounded-xl border border-neutral-800 bg-neutral-900 p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold">
                    {wallet.label}
                  </h3>

                  <p className="mt-2 break-all font-mono text-sm text-neutral-400">
                    {wallet.address}
                  </p>

                  <p className="mt-2 text-xs text-neutral-500">
                    Cadastrada em{' '}
                    {new Date(
                      wallet.createdAt,
                    ).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    void handleRemove(wallet.id)
                  }
                  className="rounded-lg border border-red-800 px-5 py-3 text-sm text-red-400 hover:bg-red-950 disabled:opacity-50"
                >
                  Remover
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
