
import { api } from '../../lib/api/client'
import type {
  AuthSession,
  LoginInput,
  RegisterInput,
  User,
} from '../../types/auth'

export const authService = {
  async register(input: RegisterInput): Promise<AuthSession> {
    const response = await api.post<AuthSession>(
      '/auth/register',
      input,
    )

    return response.data
  },

  async login(input: LoginInput): Promise<AuthSession> {
    const response = await api.post<AuthSession>(
      '/auth/login',
      input,
    )

    return response.data
  },

  async me(signal?: AbortSignal): Promise<User | null> {
    try {
      const response = await api.get<User>('/auth/me', {
        signal,
      })

      return response.data
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
      ) {
        const response = error.response as
          | { status?: number }
          | undefined

        if (response?.status === 401) return null
      }

      throw error
    }
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },
}
