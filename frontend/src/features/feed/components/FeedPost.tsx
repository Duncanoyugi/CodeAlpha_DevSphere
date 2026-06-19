import { PostCard } from '../../../components/PostCard'
import type { Post } from '../../../types'

interface FeedPostProps {
  post: Post
}

export function FeedPost({ post }: FeedPostProps) {
  return <PostCard post={post} compact />
}
