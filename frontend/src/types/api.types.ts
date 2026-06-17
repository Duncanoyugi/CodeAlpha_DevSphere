export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
  nextCursor?: string
}

export interface ErrorResponse {
  message: string
  code?: string
  errors?: Record<string, string[]>
}