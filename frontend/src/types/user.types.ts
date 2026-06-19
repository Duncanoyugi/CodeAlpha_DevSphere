export interface User {
  id: string
  username: string
  email: string
  githubUrl?: string
  linkedInUrl?: string
  portfolioUrl?: string
  avatar?: string
  bio?: string
  experience?: string
  reputation: number
  createdAt: string
  updatedAt: string
}

export interface UserSkill {
  id: string
  userId: string
  skill: string
  level: string
  createdAt: string
}

export interface UpdateProfileInput {
  bio?: string
  experience?: string
  avatar?: string
  githubUrl?: string
  linkedInUrl?: string
  portfolioUrl?: string
}