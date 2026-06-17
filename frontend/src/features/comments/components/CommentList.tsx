import { useComments } from '../hooks/useComments'
import { CommentItem } from './CommentItem'
import { LoadingSpinner } from '../../../components/common/LoadingSpinner'
import { EmptyState } from '../../../components/common/EmptyState'
import { MessageCircle } from 'lucide-react'

interface CommentListProps {
  postId: string
}

export function CommentList({ postId }: CommentListProps) {
  const { data: comments, isLoading, error } = useComments(postId)

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-center text-sm text-destructive">
        Failed to load comments
      </p>
    )
  }

  if (!comments || comments.length === 0) {
    return (
      <EmptyState
        title="No comments yet"
        description="Be the first to share your thoughts"
        icon={<MessageCircle className="h-8 w-8 text-muted-foreground" />}
        className="py-8"
      />
    )
  }

  return (
    <div className="divide-y">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  )
}