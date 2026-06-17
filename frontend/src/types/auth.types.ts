export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  user: import('./user.types').User
  token: string
}