
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { walletService } from './walletService'
import { useAuth } from '../auth/useAuth'

export function useWallets() {
  const { data: user } = useAuth()

  return useQuery({
    queryKey: ['wallets', user?.id],
    queryFn: ({ signal }) =>
      walletService.getAll(signal),
    enabled: Boolean(user?.id),
  })
}

export function useWalletActions() {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: walletService.create,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['wallets'],
      }),
  })

  const remove = useMutation({
    mutationFn: walletService.remove,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['wallets'],
      }),
  })

  return { create, remove }
}
