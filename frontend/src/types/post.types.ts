export interface Post {
  id: string
  title: string
  content: string
  imageUrl: string | null
  mediaUrl: string | null
  mediaType: string | null
  mediaSize: number | null
  githubRepoUrl: string | null
  liveDemoUrl: string | null
  authorId: string
  tags: string[]
  shares: number
  views: number
  createdAt: string
  updatedAt: string
  repostsCount?: number
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
  reposted?: boolean
  repostedBy?: {
    id: string
    username: string
    avatar: string | null
  } | null
}

export interface CreatePostInput {
  title: string
  content: string
  tags: string[]
  imageUrl?: string
  mediaUrl?: string
  mediaType?: string
  mediaSize?: number
  githubRepoUrl?: string
  liveDemoUrl?: string
}

export interface UpdatePostInput {
  title?: string
  content?: string
  tags?: string[]
  imageUrl?: string
  githubRepoUrl?: string
  liveDemoUrl?: string
}