import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Share2, Bookmark, ImageIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { formatDate, getInitials, truncateText } from '../../../lib/utils'
import type { Post } from '../../../types'
import { useLikePost } from '../../likes/hooks/useLikePost'
import { useUnlikePost } from '../../likes/hooks/useUnlikePost'
import { useToggleBookmark } from '../../bookmarks/hooks/useToggleBookmark'

interface PostCardProps {
  post: Post
  detailed?: boolean
}

export function PostCard({ post, detailed = false }: PostCardProps) {
  const likePost = useLikePost()
  const unlikePost = useUnlikePost()
  const toggleBookmark = useToggleBookmark()

  const { author, title, content, tags, createdAt } = post
  const isLiked = useMemo(() => !!post.liked, [post.liked])
  const isBookmarked = useMemo(() => !!post.bookmarked, [post.bookmarked])

  const likesCount = post.likesCount ?? (Array.isArray(post.likes) ? post.likes.length : 0)
  const commentsCount = post.commentsCount ?? (Array.isArray(post.comments) ? post.comments.length : 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        {author && (
          <Link to={`/profile/${author.username}`}>
            <Avatar>
              <AvatarImage src={author.avatar || undefined} />
              <AvatarFallback>{getInitials(author.username)}</AvatarFallback>
            </Avatar>
          </Link>
        )}
        <div className="flex-1">
          {author && (
            <Link to={`/profile/${author.username}`} className="hover:underline">
              <span className="font-semibold">{author.username}</span>
            </Link>
          )}
          <p className="text-sm text-muted-foreground">{formatDate(createdAt)}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link to={`/post/${post.id}`}>
          <h3 className="text-xl font-semibold hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground">
            {detailed ? content : truncateText(content, 200)}
          </p>
          {post.imageUrl && !detailed && (
            <img
              src={post.imageUrl}
              alt={title}
              className="mt-3 rounded-md object-cover max-h-96 w-full"
            />
          )}
          {detailed && post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={title}
              className="mt-3 rounded-md object-cover max-h-[520px] w-full"
            />
          )}
        </Link>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link key={tag} to={`/technology/${tag}`}>
                <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
                  #{tag}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 ${isLiked ? 'text-red-500' : ''}`}
            onClick={() => {
              if (isLiked) unlikePost.mutate(post.id)
              else likePost.mutate(post.id)
            }}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </Button>
          <Link to={`/post/${post.id}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>{commentsCount}</span>
            </Button>
          </Link>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className={isBookmarked ? 'text-primary' : ''}
          onClick={() => toggleBookmark.mutate(post.id)}
        >
          <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </Button>
      </CardFooter>
    </Card>
  )
}
