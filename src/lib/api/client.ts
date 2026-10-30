
import axios from 'axios'

const SESSION_KEY = 'nft-marketplace-session-v1'

type StoredSession = {
  token?: string
}

function getSessionToken(): string | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)

    if (!raw) {
      return null
    }

    const session: unknown = JSON.parse(raw)

    if (
      typeof session !== 'object' ||
      session === null ||
      !('token' in session)
    ) {
      return null
    }

    const token = (session as StoredSession).token

    return typeof token === 'string' && token.trim()
      ? token
      : null
  } catch {
    return null
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getSessionToken()

  if (token) {
    config.headers.set(
      'Authorization',
      `Bearer ${token}`,
    )
  } else {
    config.headers.delete('Authorization')
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)
