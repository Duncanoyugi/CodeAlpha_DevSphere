import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { authApi } from '../../../api/auth.api'
import type { User } from '../../../types'

const userSchema = z
  .object({
    id: z.string(),
    username: z.string(),
    email: z.string().email(),
    reputation: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .passthrough()

export type MeQueryResponse = User | null

export function useMeQuery() {
  return useQuery<MeQueryResponse>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const result = await authApi.getMe()
      if (!result) return null
      const parsed = userSchema.safeParse(result)
      if (!parsed.success) {
        // If backend shape changes, fail fast at the trust boundary.
        throw new Error('Invalid /auth/me response shape')
      }
      return parsed.data as unknown as User
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
  })
}

