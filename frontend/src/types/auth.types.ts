export interface User {
  id: string
  username: string
  email: string
  avatar: string | null
  bio: string | null
  experience: string | null
  reputation: number
  lastActiveAt: string | null
  createdAt: string
  updatedAt: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  username: string
  email: string
  password: string
}