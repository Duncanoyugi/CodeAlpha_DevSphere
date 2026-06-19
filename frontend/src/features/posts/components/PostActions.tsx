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
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="h-9 rounded-lg gap-2"
        onClick={onLike}
        aria-pressed={isLiked}
      >
        <Heart className={isLiked ? 'h-4 w-4 fill-current text-[var(--brand)]' : 'h-4 w-4 text-[var(--muted-foreground)]'} />
        <span className="tabular-nums text-sm">{likesCount}</span>
      </Button>
      <Button variant="ghost" size="sm" className="h-9 rounded-lg gap-2" onClick={onComment} aria-label={`View ${commentsCount} comments`}>
        <MessageCircle className="h-4 w-4 text-[var(--muted-foreground)]" />
        <span className="tabular-nums text-sm">{commentsCount}</span>
      </Button>
      <Button variant="ghost" size="sm" className="h-9 rounded-lg" onClick={onShare} aria-label="Share post">
        <Share2 className="h-4 w-4 text-[var(--muted-foreground)]" />
      </Button>
      <Button variant="ghost" size="sm" className="h-9 rounded-lg" onClick={onBookmark} aria-label="Save post">
        <Bookmark className="h-4 w-4 text-[var(--muted-foreground)]" />
      </Button>
    </div>
  )
}
