export interface UserSkill {
  id: string
  userId: string
  skill: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  createdAt: string
}

export interface UpdateProfileInput {
  username?: string
  bio?: string
  experience?: 'Junior' | 'Mid' | 'Senior'
}