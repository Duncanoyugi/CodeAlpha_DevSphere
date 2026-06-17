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
  // Populated fields for display
  author?: {
    id: string
    username: string
    avatar: string | null
  }
  likes?: string[]
  comments?: { id: string }[]
  commentsCount?: number
  isLiked?: boolean
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