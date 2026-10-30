import { http, HttpResponse } from 'msw'
import type { User, AuthSession, LoginInput, RegisterInput, UpdateProfileInput, ChangePasswordInput } from '../../types/auth'

const USERS_KEY = 'nft-marketplace-users-v1'
const SESSION_KEY = 'nft-marketplace-session-v1'
const CREDENTIALS_KEY = 'nft-marketplace-credentials-v1'

type Credential = { salt: string; hash: string }
function readUsers(): User[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    return Array.isArray(value) ? value as User[] : []
  } catch { return [] }
}
function readSession(): AuthSession | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
    return value && typeof value === 'object' ? value as AuthSession : null
  } catch { return null }
}
function readCredentials(): Record<string, Credential> {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(CREDENTIALS_KEY) || '{}')
    return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, Credential> : {}
  } catch { return {} }
}
async function digest(password: string, salt: string): Promise<string> {
  const bytes = new TextEncoder().encode(salt + ':' + password)
  const hash = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('')
}
async function setCredential(userId: string, password: string) {
  const salt = crypto.randomUUID()
  const credentials = readCredentials()
  credentials[userId] = { salt, hash: await digest(password, salt) }
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials))
}
async function verifyCredential(userId: string, password: string) {
  const credential = readCredentials()[userId]
  return Boolean(credential && await digest(password, credential.salt) === credential.hash)
}
function createSession(user: User): AuthSession {
  const session = { user, token: 'demo-' + crypto.randomUUID() }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}
function error(message: string, status: number) {
  return HttpResponse.json({ message }, { status })
}
function currentUser(): User | null {
  const session = readSession()
  return session ? readUsers().find(user => user.id === session.user.id) ?? null : null
}
function validEmail(value: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) }
function validAvatar(value: string) {
  if (!value) return true
  if (/^data:image\/webp;base64,[A-Za-z0-9+/]+={0,2}$/.test(value) && value.length <= 150000) return true
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && value.length <= 2048
  } catch { return false }
}

export const authHandlers = [
  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json() as RegisterInput
    const name = body.name?.trim()
    const email = body.email?.trim().toLowerCase()
    if (!name || !email || !body.password) return error('Preencha todos os campos', 400)
    if (name.length > 80 || !validEmail(email)) return error('Dados de cadastro inválidos', 400)
    if (body.password.length < 8) return error('A senha deve ter pelo menos 8 caracteres', 400)
    const users = readUsers()
    if (users.some(user => user.email === email)) return error('E-mail já cadastrado', 409)
    const user: User = { id: crypto.randomUUID(), name, email, createdAt: new Date().toISOString() }
    await setCredential(user.id, body.password)
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]))
    return HttpResponse.json(createSession(user), { status: 201 })
  }),
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as LoginInput
    const email = body.email?.trim().toLowerCase()
    if (!email || !body.password) return error('Informe e-mail e senha', 400)
    const user = readUsers().find(entry => entry.email === email)
    if (!user || !await verifyCredential(user.id, body.password)) return error('E-mail ou senha inválidos', 401)
    return HttpResponse.json(createSession(user))
  }),
  http.get('/api/auth/me', () => {
    const user = currentUser()
    return user ? HttpResponse.json(user) : error('Sessão não encontrada', 401)
  }),
  http.patch('/api/profile', async ({ request }) => {
    const user = currentUser()
    if (!user) return error('Sessão não encontrada', 401)
    const body = await request.json() as UpdateProfileInput
    const name = body.name?.trim()
    const email = body.email?.trim().toLowerCase()
    const avatarUrl = body.avatarUrl?.trim() ?? ''
    if (!name || name.length > 80 || !email || !validEmail(email)) return error('Nome ou e-mail inválido', 400)
    if (!validAvatar(avatarUrl)) return error('Informe uma URL HTTPS válida para o avatar', 400)
    const users = readUsers()
    if (users.some(entry => entry.id !== user.id && entry.email === email)) return error('E-mail já cadastrado', 409)
    const updated: User = { ...user, name, email, avatarUrl }
    localStorage.setItem(USERS_KEY, JSON.stringify(users.map(entry => entry.id === user.id ? updated : entry)))
    const session = readSession()
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, user: updated }))
    return HttpResponse.json(updated)
  }),
  http.patch('/api/profile/password', async ({ request }) => {
    const user = currentUser()
    if (!user) return error('Sessão não encontrada', 401)
    const body = await request.json() as ChangePasswordInput
    if (!body.currentPassword || !body.newPassword) return error('Preencha as duas senhas', 400)
    if (!await verifyCredential(user.id, body.currentPassword)) return error('Senha atual incorreta', 400)
    if (body.newPassword.length < 8) return error('A nova senha deve ter pelo menos 8 caracteres', 400)
    if (body.currentPassword === body.newPassword) return error('Escolha uma senha diferente da atual', 400)
    await setCredential(user.id, body.newPassword)
    return HttpResponse.json({ success: true })
  }),
  http.post('/api/auth/logout', () => {
    localStorage.removeItem(SESSION_KEY)
    return HttpResponse.json({ success: true })
  }),
]
