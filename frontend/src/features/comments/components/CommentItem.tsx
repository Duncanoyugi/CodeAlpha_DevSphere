import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { Button } from '../../../components/ui/button'
import { formatDate, getInitials } from '../../../lib/utils'
import { useAuth } from '../../auth/hooks/useAuth'
import { useDeleteComment } from '../hooks/useComments'
import type { Comment } from '../../../types'

interface CommentItemProps {
  comment: Comment
}

export function CommentItem({ comment }: CommentItemProps) {
  const { user } = useAuth()
  const deleteComment = useDeleteComment()
  const author = comment.author
  const isAuthor = author && user?.id === author.id

  return (
    <div className="flex gap-3 py-3">
      {author && (
        <Link to={`/profile/${author.username}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={author.avatar || undefined} />
            <AvatarFallback>{getInitials(author.username)}</AvatarFallback>
          </Avatar>
        </Link>
      )}
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          {author && (
            <Link to={`/profile/${author.username}`} className="hover:underline">
              <span className="font-semibold text-sm">{author.username}</span>
            </Link>
          )}
          <span className="text-xs text-muted-foreground">
            {formatDate(comment.createdAt)}
          </span>
        </div>
        <p className="text-sm">{comment.content}</p>
        {isAuthor && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
            onClick={() => deleteComment.mutate(comment.id)}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        )}
      </div>
    </div>
  )
}