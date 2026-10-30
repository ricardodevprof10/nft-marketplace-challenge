
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { favoriteService } from './favoriteService'
import { useAuth } from '../auth/useAuth'

export function useFavorites() {
  const { data: user } = useAuth()

  return useQuery({
    queryKey: ['favorites', user?.id ?? 'guest'],
    queryFn: favoriteService.list,
    enabled: Boolean(user?.id),
    retry: false,
  })
}

export function useFavoriteActions() {
  const queryClient = useQueryClient()
  const { data: user } = useAuth()

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ['favorites', user?.id ?? 'guest'],
    })

  const add = useMutation({
    mutationFn: favoriteService.add,
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: favoriteService.remove,
    onSuccess: invalidate,
  })

  return { add, remove }
}
