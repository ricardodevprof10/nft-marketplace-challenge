
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth, useAuthActions } from './useAuth'

export function ProfilePage() {
  const navigate = useNavigate()
  const { data: user } = useAuth()
  const { logout } = useAuthActions()

  async function handleLogout() {
    try {
      await logout.mutateAsync()
      await navigate({ to: '/login' })
    } catch {
      // A mensagem de erro aparece no componente.
    }
  }

  if (!user) return null

  return (
    <main className="mx-auto min-h-[70vh] max-w-5xl px-5 py-12">
      <h1 className="text-4xl font-bold">
        Meu perfil
      </h1>

      <p className="mt-3 text-neutral-400">
        Informações da sua conta demonstrativa.
      </p>

      <section className="mt-10 rounded-xl border border-neutral-800 bg-neutral-900 p-8">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-900 text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              {user.name}
            </h2>

            <p className="mt-1 text-neutral-400">
              {user.email}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 border-t border-neutral-800 pt-8 sm:grid-cols-2">
          <div>
            <p className="text-sm text-neutral-400">
              Identificador
            </p>
            <p className="mt-2 break-all text-sm">
              {user.id}
            </p>
          </div>

          <div>
            <p className="text-sm text-neutral-400">
              Cadastro
            </p>
            <p className="mt-2">
              {new Date(user.createdAt).toLocaleDateString(
                'pt-BR',
              )}
            </p>
          </div>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          to="/wallets"
          className="rounded-lg bg-red-600 px-6 py-3 font-semibold hover:bg-red-700"
        >
          Minhas carteiras
        </Link>

        <button
          type="button"
          disabled={logout.isPending}
          onClick={() => void handleLogout()}
          className="rounded-lg border border-neutral-700 px-6 py-3 hover:border-red-500 disabled:opacity-50"
        >
          {logout.isPending ? 'Saindo...' : 'Sair da conta'}
        </button>
      </div>

      {logout.isError && (
        <p role="alert" className="mt-5 text-red-400">
          Não foi possível encerrar a sessão.
        </p>
      )}
    </main>
  )
}
