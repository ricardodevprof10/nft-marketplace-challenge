
import { useState } from 'react'
import {
  Link,
  useNavigate,
} from '@tanstack/react-router'
import { useAuthActions } from './useAuth'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuthActions()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setError('')

    try {
      await register.mutateAsync({
        name,
        email,
        password,
      })

      await navigate({ to: '/profile' })
    } catch {
      setError(
        'Não foi possível criar a conta. Verifique os dados ou utilize outro e-mail.',
      )
    }
  }

  const inputClassName =
    'w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white outline-none transition-colors focus:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950'

  return (
    <main className="mx-auto min-h-[70vh] max-w-md px-5 py-16">
      <h1 className="text-4xl font-bold">
        Criar conta
      </h1>

      <p className="mt-3 text-neutral-400">
        Cadastre seu perfil no Marketplace demonstrativo.
      </p>

      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="mt-8 space-y-5"
      >
        <div>
          <label
            htmlFor="register-name"
            className="mb-2 block text-sm"
          >
            Nome
          </label>

          <input
            id="register-name"
            type="text"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="register-email"
            className="mb-2 block text-sm"
          >
            E-mail
          </label>

          <input
            id="register-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="register-password"
            className="mb-2 block text-sm"
          >
            Senha de demonstração
          </label>

          <input
            id="register-password"
            type="password"
            required
            minLength={8}
            autoComplete="off"
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
          disabled={register.isPending}
          className="w-full rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {register.isPending
            ? 'Cadastrando...'
            : 'Criar conta'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-400">
        Já possui conta?{' '}
        <Link
          to="/login"
          className="font-semibold text-red-400 underline underline-offset-4 transition-colors hover:text-red-300 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400"
        >
          Entrar
        </Link>
      </p>

      <p className="mt-8 text-xs leading-5 text-neutral-400">
        Utilize somente dados fictícios. A senha não é
        armazenada nem verificada neste protótipo.
      </p>
    </main>
  )
}
