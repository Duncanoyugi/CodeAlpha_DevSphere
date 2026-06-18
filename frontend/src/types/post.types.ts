export interface Post {
  id: string
  title: string
  content: string
  imageUrl: string | null
  authorId: string
  tags: string[]
  shares: number
  views: number
  createdAt: string
  updatedAt: string
  // Counts from API
  likesCount?: number
  commentsCount?: number
  viewsCount?: number
  sharesCount?: number
  // Populated fields for display
  author?: {
    id: string
    username: string
    avatar: string | null
  }
  // Arrays from legacy API or for optimistic updates
  likes?: string[]
  comments?: { id: string }[]
  // Status flags
  liked?: boolean
  bookmarked?: boolean
}

export interface CreatePostInput {
  title: string
  content: string
  tags: string[]
  imageUrl?: string
}

export interface UpdatePostInput {
  title?: string
  content?: string
  tags?: string[]
}