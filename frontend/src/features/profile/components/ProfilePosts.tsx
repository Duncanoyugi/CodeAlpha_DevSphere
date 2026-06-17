import { useUserPosts } from '../../posts/hooks/usePosts'
import { PostCard } from '../../posts/components/PostCard'
import { LoadingSpinner } from '../../../components/common/LoadingSpinner'
import { EmptyState } from '../../../components/common/EmptyState'

interface ProfilePostsProps {
  userId: string
}

export function ProfilePosts({ userId }: ProfilePostsProps) {
  const { data: posts, isLoading, error } = useUserPosts(userId)

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-center text-sm text-destructive">
        Failed to load posts
      </p>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <EmptyState
        title="No posts yet"
        description="This user hasn't created any posts yet."
        className="py-8"
      />
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}