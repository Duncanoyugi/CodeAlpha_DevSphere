import { useUserPosts } from '../../posts/hooks/usePosts'
import { PostCard } from '../../../components/PostCard'
import { FeedSkeleton } from '../../../components/LoadingSkeleton'
import { EmptyState } from '../../../components/common/EmptyState'
import { Hash } from 'lucide-react'

interface ProfilePostsProps {
  userId: string
}

export function ProfilePosts({ userId }: ProfilePostsProps) {
  const { data: posts, isLoading, error } = useUserPosts(userId)

  if (isLoading) {
    return <FeedSkeleton />
  }

  if (error) {
    return (
      <EmptyState
        title="Posts unavailable"
        description="Failed to load posts."
        icon={<Hash className="h-12 w-12" />}
      />
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <EmptyState
        title="No posts yet"
        description="This user hasn't created any posts yet."
        icon={<Hash className="h-12 w-12" />}
      />
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
