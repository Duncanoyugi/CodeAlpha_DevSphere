import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Reply, Trash2 } from 'lucide-react'
import { Avatar } from '../../../components/Avatar'
import { Button } from '../../../components/ui/button'
import { formatDate } from '../../../lib/utils'
import { useAuth } from '../../auth/hooks/useAuth'
import { useDeleteComment } from '../hooks/useComments'
import type { Comment } from '../../../types'
import { CommentForm } from './CommentForm'

interface CommentItemProps {
  comment: Comment
  postId: string
  depth?: number
}

export function CommentItem({ comment, postId, depth = 0 }: CommentItemProps) {
  const { user } = useAuth()
  const deleteComment = useDeleteComment()
  const author = comment.author
  const isAuthor = author && user?.id === author.id

  const [replying, setReplying] = useState(false)

  return (
    <div className="flex gap-3 py-3">
      {author && (
        <Link to={`/profile/${author.username}`} aria-label={`Open ${author.username} profile`}>
          <Avatar name={author.username} src={author.avatar || null} size="sm" />
        </Link>
      )}

      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          {author && (
            <Link to={`/profile/${author.username}`} className="font-semibold text-sm text-[var(--foreground)] transition-colors hover:text-[var(--brand)]">
              {author.username}
            </Link>
          )}
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">{formatDate(comment.createdAt)}</span>
        </div>

        <p className="text-sm leading-6 text-[var(--foreground)]">{comment.content}</p>

        <div className="flex items-center gap-2">
          {user && !isAuthor && depth < 2 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 rounded-lg px-2 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              onClick={() => setReplying((value) => !value)}
            >
              <Reply className="h-3.5 w-3.5" aria-hidden="true" />
              Reply
            </Button>
          )}

          {isAuthor && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 rounded-lg px-2 text-xs text-[var(--muted-foreground)] hover:text-[var(--destructive)]"
              onClick={() => deleteComment.mutate({ commentId: comment.id, postId })}
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Delete
            </Button>
          )}
        </div>

        {replying && (
          <div className={depth === 0 ? 'mt-2' : 'mt-2 ml-4'}>
            <CommentForm postId={postId} parentId={comment.id} />
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map((reply) => (
              <div key={reply.id} className={depth === 0 ? 'ml-4' : 'ml-6'}>
                <CommentItem comment={reply} postId={postId} depth={depth + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
