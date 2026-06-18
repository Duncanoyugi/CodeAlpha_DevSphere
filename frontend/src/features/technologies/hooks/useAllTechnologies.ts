import { useQuery } from '@tanstack/react-query'
import api from '../../../api/client'
import type { Technology } from '../../../types'

export function useAllTechnologies() {
  return useQuery({
    queryKey: ['technologies'],
    queryFn: async (): Promise<Technology[]> => {
      const { data } = await api.get('/technologies', { params: { limit: 100 } })
      const techs = data as Array<{ name: string; followers: number; postCount: number }>
      return techs.map((t) => ({
        name: t.name,
        followers: t.followers,
        totalPosts: t.postCount,
      }))
    },
    staleTime: 5 * 60 * 1000,
  })
}