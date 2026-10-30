import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { walletService } from './walletService'
import { useAuth } from '../auth/useAuth'

export function useWallets() {
  const { data: user } = useAuth()
  return useQuery({
    queryKey: ['wallets', user?.id],
    queryFn: ({ signal }) => walletService.getAll(signal),
    enabled: Boolean(user?.id),
  })
}

export function useWalletActions() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['wallets'] })
  const create = useMutation({ mutationFn: walletService.create, onSuccess: invalidate })
  const update = useMutation({ mutationFn: walletService.update, onSuccess: invalidate })
  const remove = useMutation({ mutationFn: walletService.remove, onSuccess: invalidate })
  return { create, update, remove }
}
