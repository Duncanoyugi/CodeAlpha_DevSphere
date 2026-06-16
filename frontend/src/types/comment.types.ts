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
}

export interface CreateCommentInput {
  content: string
  postId: string
}