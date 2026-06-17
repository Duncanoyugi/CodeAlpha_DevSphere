import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react'
import { Button } from '../../../components/ui/button'

interface PostActionsProps {
  postId: string
  likesCount: number
  commentsCount: number
  isLiked?: boolean
  onLike?: () => void
  onComment?: () => void
  onShare?: () => void
  onBookmark?: () => void
}

export function PostActions({
  likesCount,
  commentsCount,
  isLiked = false,
  onLike,
  onComment,
  onShare,
  onBookmark,
}: PostActionsProps) {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        className={`gap-2 ${isLiked ? 'text-red-500' : ''}`}
        onClick={onLike}
      >
        <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
        <span>{likesCount}</span>
      </Button>
      <Button variant="ghost" size="sm" className="gap-2" onClick={onComment}>
        <MessageCircle className="h-4 w-4" />
        <span>{commentsCount}</span>
      </Button>
      <Button variant="ghost" size="sm" onClick={onShare}>
        <Share2 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={onBookmark}>
        <Bookmark className="h-4 w-4" />
      </Button>
    </div>
  )
}