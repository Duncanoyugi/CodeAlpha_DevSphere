import { useComments } from '../hooks/useComments'
import { CommentItem } from './CommentItem'
import { FeedSkeleton } from '../../../components/LoadingSkeleton'
import { EmptyState } from '../../../components/common/EmptyState'
import { MessageCircle } from 'lucide-react'

interface CommentListProps {
  postId: string
}

export function CommentList({ postId }: CommentListProps) {
  const { data: comments, isLoading, error } = useComments(postId)

  if (isLoading) {
    return <FeedSkeleton />
  }

  if (error) {
    return (
      <EmptyState
        title="Comments unavailable"
        description="Failed to load comments."
        icon={<MessageCircle className="h-12 w-12" />}
      />
    )
  }

  if (!comments || comments.length === 0) {
    return (
      <EmptyState
        title="No comments yet"
        description="Be the first to share your thoughts."
        icon={<MessageCircle className="h-12 w-12" />}
        className="py-8"
      />
    )
  }

  return (
    <div className="divide-y divide-[var(--border)]">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} postId={postId} depth={0} />
      ))}
    </div>
  )

}
