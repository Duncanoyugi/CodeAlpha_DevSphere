import type { User } from './user.types'

export interface Follow {
  id: string
  followerId: string
  followingId: string
  createdAt: string
  follower?: User
  following?: User
}