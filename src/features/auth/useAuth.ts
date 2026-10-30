
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { authService } from './authService'

export const authQueryKey = ['auth', 'me'] as const

export function useAuth() {
  return useQuery({
    queryKey: authQueryKey,
    queryFn: ({ signal }) => authService.me(signal),
    retry: false,
    staleTime: 0,
  })
}

export function useAuthActions() {
  const queryClient = useQueryClient()

  function clearUserData() {
    queryClient.removeQueries({
      queryKey: ['favorites'],
    })

    queryClient.removeQueries({
      queryKey: ['wallets'],
    })
  }

  const register = useMutation({
    mutationFn: authService.register,
    onSuccess: (session) => {
      clearUserData()

      queryClient.setQueryData(
        authQueryKey,
        session.user,
      )
    },
  })

  const login = useMutation({
    mutationFn: authService.login,
    onSuccess: (session) => {
      clearUserData()

      queryClient.setQueryData(
        authQueryKey,
        session.user,
      )
    },
  })

  const logout = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.setQueryData(authQueryKey, null)
      clearUserData()
    },
  })

  return { register, login, logout }
}
