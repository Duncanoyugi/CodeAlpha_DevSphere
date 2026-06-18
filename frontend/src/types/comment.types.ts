export interface Comment {
  id: string
  content: string
  authorId: string
  postId: string
  createdAt: string
  author?: {
    id: string
    username: string
    avatar: string | null
  }
  replies?: Comment[]
}

export interface CreateCommentInput {
  content: string
  postId: string
  parentId?: string
}

