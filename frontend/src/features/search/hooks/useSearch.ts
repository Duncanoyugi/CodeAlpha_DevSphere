import { useQuery } from '@tanstack/react-query'
import { usersApi } from '../../../api/users.api'

export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: ['search', 'users', query],
    queryFn: () => usersApi.searchUsers(query),
    enabled: query.length >= 2,
  })
}