
import { useState } from 'react'
import {
  Link,
  useNavigate,
} from '@tanstack/react-router'
import { useAuthActions } from './useAuth'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthActions()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setError('')

    try {
      await login.mutateAsync({
        email,
        password,
      })

      await navigate({ to: '/profile' })
    } catch {
      setError(
        'Não foi possível entrar. Verifique o e-mail cadastrado.',
      )
    }
  }

  const inputClassName =
    'w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white outline-none transition-colors focus:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950'

  return (
    <main className="mx-auto min-h-[70vh] max-w-md px-5 py-16">
      <h1 className="text-4xl font-bold">
        Entrar
      </h1>

      <p className="mt-3 text-neutral-400">
        Acesse sua conta de demonstração.
      </p>

      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="mt-8 space-y-5"
      >
        <div>
          <label
            htmlFor="login-email"
            className="mb-2 block text-sm"
          >
            E-mail
          </label>

          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="mb-2 block text-sm"
          >
            Senha de demonstração
          </label>

          <input
            id="login-password"
            type="password"
            autoComplete="off"
            required
            minLength={8}
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            className={inputClassName}
          />
        </div>

        {error && (
          <p
            role="alert"
            className="text-sm text-red-400"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={login.isPending}
          className="w-full rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {login.isPending
            ? 'Entrando...'
            : 'Entrar'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-400">
        Não possui conta?{' '}
        <Link
          to="/register"
          className="font-semibold text-red-400 underline underline-offset-4 transition-colors hover:text-red-300 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400"
        >
          Criar conta
        </Link>
      </p>

      <p className="mt-8 text-xs leading-5 text-neutral-400">
        Autenticação simulada. Não utilize sua senha real:
        este ambiente não verifica senhas nem oferece
        segurança de conta.
      </p>
    </main>
  )
}
