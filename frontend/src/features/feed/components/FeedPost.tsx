import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { formatDate, getInitials, truncateText } from '../../../lib/utils'
import type { Post } from '../../../types'
import { useLikePost } from '../../likes/hooks/useLikePost'
import { useUnlikePost } from '../../likes/hooks/useUnlikePost'

interface FeedPostProps {
  post: Post
}

export function FeedPost({ post }: FeedPostProps) {
  const likePost = useLikePost()
  const unlikePost = useUnlikePost()

  const { author, title, content, tags, createdAt, likes, comments } = post
  const isLiked = useMemo(() => !!post.isLiked, [post.isLiked])

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
          <p className="text-muted-foreground">{truncateText(content, 200)}</p>
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
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (isLiked) unlikePost.mutate(post.id)
              else likePost.mutate(post.id)
            }}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likes?.length || 0}</span>
          </Button>
          <Link to={`/post/${post.id}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>{comments?.length || 0}</span>
            </Button>
          </Link>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="ghost" size="sm">
          <Bookmark className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

