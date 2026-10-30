
import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { useAuth } from './useAuth'

interface ProtectedPageProps {
  children: ReactNode
}

export function ProtectedPage({
  children,
}: ProtectedPageProps) {
  const { data: user, isPending, isError, refetch } =
    useAuth()

  if (isPending) {
    return (
      <main
        role="status"
        className="mx-auto max-w-5xl px-5 py-16"
      >
        Verificando sessão...
      </main>
    )
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-16">
        <h1 className="text-2xl font-bold">
          Erro ao verificar a sessão
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

  if (!user) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-16">
        <h1 className="text-3xl font-bold">
          Acesso à conta
        </h1>

        <p className="mt-4 text-neutral-400">
          Entre na conta de demonstração para acessar
          esta página.
        </p>

        <Link
          to="/login"
          className="mt-6 inline-block rounded-lg bg-red-600 px-6 py-3 font-semibold"
        >
          Entrar
        </Link>
      </main>
    )
  }

  return <>{children}</>
}
