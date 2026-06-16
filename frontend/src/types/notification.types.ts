export interface Notification {
  id: string
  userId: string
  type: 'LIKE' | 'FOLLOW' | 'COMMENT'
  actorId: string
  actorName: string
  postId: string | null
  commentId: string | null
  read: boolean
  createdAt: string
}