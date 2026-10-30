import { useState, type FormEvent } from 'react'
import { useWallets, useWalletActions } from './useWallets'
import type { Wallet } from '../../types/wallet'

function getError(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = error.response as { data?: { message?: string } }
    if (response?.data?.message) return response.data.message
  }
  return 'Não foi possível concluir a operação.'
}

export function WalletsPage() {
  const { data: wallets, isPending, isError, refetch } = useWallets()
  const { create, update, remove } = useWalletActions()
  const [editing, setEditing] = useState<string | null>(null)
  const [label, setLabel] = useState('')
  const [address, setAddress] = useState('')
  const [isPrimary, setIsPrimary] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState('')
  const busy = create.isPending || update.isPending || remove.isPending
  const fieldClass = 'mt-2 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none focus:border-red-500'

  function reset() {
    setEditing(null)
    setLabel('')
    setAddress('')
    setIsPrimary(false)
  }

  function editWallet(wallet: Wallet) {
    setEditing(wallet.id)
    setLabel(wallet.label)
    setAddress(wallet.address)
    setIsPrimary(Boolean(wallet.isPrimary))
    setMessage('')
    setSuccess('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    setSuccess('')
    try {
      if (editing) {
        await update.mutateAsync({ walletId: editing, label, address, isPrimary })
        setSuccess('Carteira atualizada com sucesso.')
      } else {
        await create.mutateAsync({ label, address, isPrimary })
        setSuccess('Carteira cadastrada com sucesso.')
      }
      reset()
    } catch (error) {
      setMessage(getError(error))
    }
  }

  async function handleRemove(walletId: string) {
    setMessage('')
    setSuccess('')
    try {
      await remove.mutateAsync(walletId)
      if (editing === walletId) reset()
      setSuccess('Carteira removida com sucesso.')
    } catch (error) {
      setMessage(getError(error))
    }
  }

  return (
    <main className="mx-auto min-h-[70vh] max-w-5xl px-5 py-12 text-white">
      <h1 className="text-4xl font-bold">Minhas carteiras</h1>
      <p className="mt-3 text-neutral-400">Gerencie endereços públicos Ethereum para demonstração.</p>

      <section className="mt-10 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="text-xl font-semibold">{editing ? 'Editar carteira' : 'Adicionar carteira'}</h2>
        <form onSubmit={(event) => void handleSave(event)} className="mt-6 space-y-5">
          <div>
            <label htmlFor="wallet-label">Nome da carteira</label>
            <input id="wallet-label" required maxLength={60} value={label} onChange={event => setLabel(event.target.value)} placeholder="Minha carteira de teste" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="wallet-address">Endereço público Ethereum</label>
            <input id="wallet-address" required value={address} onChange={event => setAddress(event.target.value)} placeholder="0x..." spellCheck={false} className={fieldClass + ' font-mono text-sm'} />
          </div>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={isPrimary} onChange={event => setIsPrimary(event.target.checked)} className="h-5 w-5 accent-red-600" />
            Definir como carteira principal
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={busy} className="rounded-lg bg-red-600 px-6 py-3 font-semibold hover:bg-red-700 disabled:opacity-50">
              {busy ? 'Salvando...' : editing ? 'Salvar alterações' : 'Adicionar carteira'}
            </button>
            {editing && <button type="button" onClick={reset} disabled={busy} className="rounded-lg border border-neutral-700 px-6 py-3 hover:border-red-500">Cancelar edição</button>}
          </div>
        </form>
        <p className="mt-5 text-xs leading-5 text-neutral-500">Use somente endereços públicos fictícios ou de teste. Nunca informe chaves privadas ou frases de recuperação.</p>
      </section>

      {message && <p role="alert" className="mt-6 rounded-lg border border-red-700 p-4 text-red-400">{message}</p>}
      {success && <p role="status" className="mt-6 rounded-lg border border-neutral-700 p-4 text-neutral-200">{success}</p>}

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Carteiras cadastradas</h2>
        {isPending ? (
          <p role="status" className="mt-6 text-neutral-400">Carregando carteiras...</p>
        ) : isError ? (
          <div className="mt-6">
            <p className="text-red-400">Não foi possível carregar as carteiras.</p>
            <button type="button" onClick={() => void refetch()} className="mt-4 rounded-lg border border-neutral-700 px-5 py-3">Tentar novamente</button>
          </div>
        ) : !wallets?.length ? (
          <div className="mt-6 rounded-xl border border-neutral-800 p-8">
            <p className="text-neutral-400">Nenhuma carteira cadastrada.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {wallets.map(wallet => (
              <article key={wallet.id} className="flex flex-col gap-4 rounded-xl border border-neutral-800 bg-neutral-900 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold">{wallet.label}</h3>
                    {wallet.isPrimary && <span className="rounded border border-red-700 px-2 py-1 text-xs text-red-300">Principal</span>}
                  </div>
                  <p className="mt-2 break-all font-mono text-sm text-neutral-400">{wallet.address}</p>
                  <p className="mt-2 text-xs text-neutral-500">Cadastrada em {new Date(wallet.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button type="button" disabled={busy} onClick={() => editWallet(wallet)} className="rounded-lg border border-neutral-700 px-5 py-3 text-sm hover:border-red-500 disabled:opacity-50">Editar</button>
                  <button type="button" disabled={busy} onClick={() => void handleRemove(wallet.id)} className="rounded-lg border border-red-800 px-5 py-3 text-sm text-red-400 hover:bg-red-950 disabled:opacity-50">Remover</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
