import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, ExternalLink, Heart, Link as LinkIcon, MessageCircle, Share2 } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Avatar } from './Avatar'
import { TagChip } from './TagChip'
import { formatDate, truncateText } from '../lib/utils'
import type { Post } from '../types'
import { useLikePost } from '../features/likes/hooks/useLikePost'
import { useUnlikePost } from '../features/likes/hooks/useUnlikePost'
import { useToggleBookmark } from '../features/bookmarks/hooks/useToggleBookmark'
import { useToast } from './ui/use-toast'

interface PostCardProps {
  post: Post
  detailed?: boolean
  compact?: boolean
}

export function PostCard({ post, detailed = false, compact = false }: PostCardProps) {
  const likePost = useLikePost()
  const unlikePost = useUnlikePost()
  const toggleBookmark = useToggleBookmark()
  const { toast } = useToast()

  const { author, title, content, tags, createdAt, githubRepoUrl, liveDemoUrl } = post
  const initialLiked = useMemo(() => !!post.liked, [post.liked])
  const initialBookmarked = useMemo(() => !!post.bookmarked, [post.bookmarked])
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)
  const [likesCount, setLikesCount] = useState(post.likesCount ?? (Array.isArray(post.likes) ? post.likes.length : 0))
  const commentsCount = post.commentsCount ?? (Array.isArray(post.comments) ? post.comments.length : 0)

  const handleToggleLike = () => {
    if (isLiked) {
      unlikePost.mutate(post.id)
      setLikesCount((count) => Math.max(0, count - 1))
    } else {
      likePost.mutate(post.id)
      setLikesCount((count) => count + 1)
    }
    setIsLiked((value) => !value)
  }

  const handleToggleBookmark = () => {
    toggleBookmark.mutate(post.id)
    setIsBookmarked((value) => !value)
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/post/${post.id}`
    const shareData = {
      title,
      text: content,
      url: shareUrl,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }

      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: 'Link copied',
        description: 'Post link copied to clipboard.',
      })
    } catch {
      toast({
        title: 'Unable to share',
        description: 'Your browser blocked sharing this post.',
        variant: 'destructive',
      })
    }
  }

  const bodyText = detailed ? content : truncateText(content, compact ? 160 : 220)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 p-5">
        {author ? (
          <Link to={`/profile/${author.username}`} aria-label={`Open ${author.username} profile`}>
            <Avatar name={author.username} src={author.avatar} size="md" />
          </Link>
        ) : (
          <Avatar name="DevSphere" size="md" />
        )}
        <div className="min-w-0 flex-1">
          {author ? (
            <Link to={`/profile/${author.username}`} className="block truncate font-semibold text-[var(--foreground)] transition-colors hover:text-[var(--brand)]">
              {author.username}
            </Link>
          ) : (
            <p className="font-semibold text-[var(--foreground)]">DevSphere</p>
          )}
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            {formatDate(createdAt)}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-5 pt-0">
        <Link to={`/post/${post.id}`} className="group block">
          <h3 className="text-xl font-semibold leading-snug tracking-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--brand)]">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
            {bodyText}
          </p>
        {post.imageUrl && !compact && (
          <img
            src={post.imageUrl}
            alt={title}
            className="mt-4 w-full rounded-xl border border-[var(--border)] object-cover"
          />
        )}
        {post.mediaUrl && !post.mediaType?.startsWith('image/') && !compact && (
          <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)]">
            {post.mediaType?.startsWith('video/') ? (
              <video src={post.mediaUrl} controls className="w-full" />
            ) : (
              <div className="flex min-h-[160px] items-center justify-center p-6 text-center">
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Attached document</p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">{post.mediaType || 'Document'}</p>
                  <a
                    href={post.mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--brand)] px-3 py-1.5 text-xs font-medium text-[var(--brand-foreground)]"
                  >
                    Open attachment
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
        </Link>

        {(githubRepoUrl || liveDemoUrl) && (
          <div className="flex flex-wrap gap-2">
            {githubRepoUrl && (
              <a
                href={githubRepoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
              >
                <LinkIcon className="h-3.5 w-3.5" aria-hidden="true" />
                View Repo
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            )}
            {liveDemoUrl && (
              <a
                href={liveDemoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
              >
                <LinkIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Live Demo
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            )}
          </div>
        )}

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2" aria-label="Post tags">
            {tags.map((tag) => (
              <TagChip key={tag} tag={tag} href={`/technology/${tag}`} />
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-[var(--border)] px-5 py-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 rounded-lg gap-2"
            onClick={handleToggleLike}
            aria-pressed={isLiked}
          >
            <Heart className={cnHeart(isLiked)} />
            <span className="tabular-nums text-sm">{likesCount}</span>
          </Button>
          <Link to={`/post/${post.id}`}>
            <Button variant="ghost" size="sm" className="h-9 rounded-lg gap-2" aria-label={`View ${commentsCount} comments`}>
              <MessageCircle className="h-4 w-4 text-[var(--muted-foreground)]" />
              <span className="tabular-nums text-sm">{commentsCount}</span>
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="h-9 rounded-lg" onClick={handleShare} aria-label="Share post">
            <Share2 className="h-4 w-4 text-[var(--muted-foreground)]" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 rounded-lg"
          onClick={handleToggleBookmark}
          aria-label={isBookmarked ? 'Unsave post' : 'Save post'}
          aria-pressed={isBookmarked}
        >
          <Bookmark className={cnBookmark(isBookmarked)} />
        </Button>
      </CardFooter>
    </Card>
  )
}

function cnHeart(isLiked: boolean) {
  return `h-4 w-4 ${isLiked ? 'fill-current text-[var(--brand)]' : 'text-[var(--muted-foreground)]'}`
}

function cnBookmark(isBookmarked: boolean) {
  return `h-4 w-4 ${isBookmarked ? 'fill-current text-[var(--brand)]' : 'text-[var(--muted-foreground)]'}`
}
