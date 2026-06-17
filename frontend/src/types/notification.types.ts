export interface Notification {
  id: string
  userId: string
  type: 'LIKE' | 'FOLLOW' | 'COMMENT' | 'BADGE'
  actorId: string
  actorName: string
  postId: string | null
  commentId: string | null
  read: boolean
  createdAt: string
}