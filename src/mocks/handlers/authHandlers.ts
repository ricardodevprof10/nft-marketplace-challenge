
import { http, HttpResponse } from 'msw'
import type {
  User,
  AuthSession,
  LoginInput,
  RegisterInput,
} from '../../types/auth'

const USERS_KEY = 'nft-marketplace-users-v1'
const SESSION_KEY = 'nft-marketplace-session-v1'

function readUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed as User[] : []
  } catch {
    return []
  }
}

function readSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthSession
  } catch {
    return null
  }
}

function createSession(user: User): AuthSession {
  const session: AuthSession = {
    user,
    token: `demo-${crypto.randomUUID()}`,
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

function error(message: string, status: number) {
  return HttpResponse.json({ message }, { status })
}

export const authHandlers = [
  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json() as RegisterInput

    const name = body.name?.trim()
    const email = body.email?.trim().toLowerCase()
    const password = body.password

    if (!name || !email || !password) {
      return error('Preencha todos os campos', 400)
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return error('E-mail inválido', 400)
    }

    if (password.length < 8) {
      return error('A senha deve ter pelo menos 8 caracteres', 400)
    }

    const users = readUsers()

    if (users.some((user) => user.email === email)) {
      return error('E-mail já cadastrado', 409)
    }

    const user: User = {
      id: crypto.randomUUID(),
      name,
      email,
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem(
      USERS_KEY,
      JSON.stringify([...users, user]),
    )

    return HttpResponse.json(createSession(user), {
      status: 201,
    })
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as LoginInput

    const email = body.email?.trim().toLowerCase()

    if (!email || !body.password) {
      return error('Informe e-mail e senha', 400)
    }

    const user = readUsers().find(
      (entry) => entry.email === email,
    )

    if (!user) {
      return error('Conta de demonstração não encontrada', 401)
    }

    return HttpResponse.json(createSession(user))
  }),

  http.get('/api/auth/me', () => {
    const session = readSession()

    if (!session) {
      return error('Sessão não encontrada', 401)
    }

    return HttpResponse.json(session.user)
  }),

  http.post('/api/auth/logout', () => {
    localStorage.removeItem(SESSION_KEY)

    return HttpResponse.json({
      success: true,
    })
  }),
]
